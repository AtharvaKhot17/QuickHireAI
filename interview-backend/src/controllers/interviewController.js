// src/controllers/interviewController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const uuid = require('uuid');
const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const { v4: uuidv4 } = require('uuid');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

const questionService = require('../services/questionService');
// Remove this line since we're not using backend speech-to-text
// const speechToTextService = require('../services/speechToTextService');
const geminiService = require('../services/geminiService');
const faceAnalysisService = require('../services/faceAnalysisService');
const voiceAnalysis = require('../services/voiceAnalysisService');
const { INTERVIEW_TOPICS } = require('../services/geminiService');

// Initialize active interviews map
const activeInterviews = new Map();

// Add this helper function
const initializeActiveInterviews = () => {
  if (!activeInterviews) {
    return new Map();
  }
  return activeInterviews;
};

// Controller to generate dynamic questions
const generateQuestions = (req, res) => {
  const { skills } = req.body;  // Get the skills from the request body

  // Call questionService to generate questions based on skills
  const questions = questionService.getQuestionsBySkills(skills);
  
  if (questions.length > 0) {
    return res.json({ questions });
  } else {
    return res.status(404).json({ message: 'No questions found for the provided skills.' });
  }
};

// Remove this controller since we're handling speech-to-text in frontend
// const handleSpeechToText = async (req, res) => { ... }

// Add new controller method
const analyzeAnswer = async (req, res) => {
  const { transcript, question, videoData } = req.body;

  try {
    // Parallel processing of different analyses
    const [
      technicalAnalysis,    // GPT-4 evaluation
      voiceMetrics,        // Voice analysis
      facialMetrics        // Expression analysis
    ] = await Promise.all([
      geminiService.analyzeAnswer(transcript, question),
      voiceAnalysis.analyze(transcript),
      videoData ? faceAnalysisService.analyze(videoData) : null
    ]);

    // Combine all metrics and generate final score
    const analysis = {
      technicalScore: technicalAnalysis.score,
      confidenceScore: voiceMetrics.confidenceScore,
      clarityScore: voiceMetrics.clarityScore,
      stressLevel: voiceMetrics.stressLevel,
      facialExpressions: facialMetrics?.expressions || [],
      feedback: technicalAnalysis.feedback
    };

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Error analyzing answer', error: error.message });
  }
};

const startInterview = async (req, res) => {
  try {
    const { interviewCode, skills } = req.body;
    console.log('Starting interview:', { interviewCode, skills });
    
    // Clear any existing session
    activeInterviews.delete(interviewCode);
    
    if (!interviewCode || !skills || !Array.isArray(skills)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid interview parameters',
        details: 'Interview code and skills array are required'
      });
    }

    const totalQuestions = 5;
    const skillsArray = skills.length >= totalQuestions 
      ? skills.slice(0, totalQuestions) 
      : [...skills, ...Array(totalQuestions - skills.length).fill(skills[0])];

    // Initialize interview session
    const interviewSession = {
      id: interviewCode,
      skills: skillsArray,
      status: 'active',
      startTime: new Date(),
      currentQuestionIndex: 0,
      totalQuestions,
      questions: [],
      answers: []
    };

    // Generate first question
    try {
      const firstQuestion = await geminiService.generateQuestion(skillsArray[0], []);
      interviewSession.questions.push({
        ...firstQuestion,
        id: Math.random().toString(36).substr(2, 9),
        skill: skillsArray[0],
        questionNumber: 1
      });
    } catch (error) {
      console.error('Error generating first question:', error);
      interviewSession.questions.push(getFallbackQuestion(skillsArray[0]));
    }

    // Store the session
    activeInterviews.set(interviewCode, interviewSession);
    console.log('Interview session created:', interviewSession);
    console.log('Active sessions:', Array.from(activeInterviews.keys()));

    res.json({ 
      success: true, 
      interview: interviewSession,
      message: 'Interview started successfully'
    });
  } catch (error) {
    console.error('Error in startInterview:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to start interview',
      details: error.message
    });
  }
};

const getInterviewSession = (interviewCode) => {
  const session = activeInterviews.get(interviewCode);
  console.log('Getting session for code:', interviewCode);
  console.log('Session found:', session ? 'yes' : 'no');
  console.log('Active sessions:', Array.from(activeInterviews.keys()));
  return session;
};

// Add a helper function for fallback questions
const getFallbackQuestion = (skill) => ({
  question: `Tell me about your experience with ${skill}`,
  topic: skill,
  difficulty: "medium",
  expectedDuration: "2-3 minutes",
  category: "experience",
  expectedKeyPoints: ["Technical knowledge", "Practical experience", "Challenges faced"]
});

const processAnswer = async (req, res) => {
  try {
    const { interviewId, transcript, currentQuestion, code, skipped, questionNumber, videoData } = req.body;
    console.log('Processing answer:', { interviewId, questionNumber });

    const interview = activeInterviews.get(interviewId);

    if (!interview) {
      return res.status(404).json({ 
        success: false,
        error: 'Interview session not found',
        details: 'The interview session has expired or does not exist'
      });
    }

    // Check if this is the final question
    const isFinalQuestion = questionNumber >= interview.totalQuestions - 1;

    // Analyze facial expressions if video data is provided
    let confidenceScore = 0;
    let facialAnalysis = null;
    if (videoData) {
      try {
        facialAnalysis = await faceAnalysisService.analyzeFrame(videoData);
        confidenceScore = facialAnalysis.confidenceScore;
        
        if (facialAnalysis.warning) {
          console.log('Facial analysis warning:', facialAnalysis.warning);
        }
      } catch (error) {
        console.error('Error analyzing face:', error);
        // Continue without facial analysis
      }
    }

    // Analyze answer using Gemini
    let analysis;
    try {
      analysis = skipped ? 
        { 
          score: 0, 
          feedback: "Question skipped",
          technicalAccuracy: 0,
          completeness: 0,
          clarity: 0
        } :
        await geminiService.analyzeAnswer(transcript, currentQuestion, code);
    } catch (analysisError) {
      console.error('Error analyzing answer:', analysisError);
      analysis = getDefaultAnalysis();
    }

    // Store answer and analysis with confidence score
    interview.answers.push({
      question: currentQuestion,
      answer: transcript,
      code: code,
      analysis: analysis,
      confidenceScore: confidenceScore,
      facialAnalysis: facialAnalysis
    });

    // Calculate running average including confidence score
    const totalScore = interview.answers.reduce((sum, ans) => {
      const technicalScore = ans.analysis?.score || 0;
      const confidenceScore = ans.confidenceScore || 0;
      return sum + (technicalScore * 0.7 + confidenceScore * 0.3); // 70% technical, 30% confidence
    }, 0);
    interview.currentScore = totalScore / interview.answers.length;

    // If it's the final question, don't generate next question
    if (isFinalQuestion) {
      interview.status = 'completed';
      return res.json({
        success: true,
        evaluation: {
          ...analysis,
          confidenceScore: confidenceScore,
          facialAnalysis: facialAnalysis
        },
        isComplete: true,
        finalScore: interview.currentScore
      });
    }

    // Generate next question
    const nextSkill = interview.skills[questionNumber + 1];
    const previousQuestions = interview.questions.map(q => q.question);
    
    let nextQuestion;
    try {
      nextQuestion = await geminiService.generateQuestion(nextSkill, previousQuestions);
      nextQuestion = {
        ...nextQuestion,
        id: Math.random().toString(36).substr(2, 9),
        skill: nextSkill,
        questionNumber: questionNumber + 1
      };
    } catch (error) {
      console.error('Error generating next question:', error);
      nextQuestion = getFallbackQuestion(nextSkill);
    }

    res.json({
      success: true,
      evaluation: {
        ...analysis,
        confidenceScore: confidenceScore,
        facialAnalysis: facialAnalysis
      },
      nextQuestion,
      progress: {
        current: questionNumber + 1,
        total: interview.totalQuestions
      }
    });

  } catch (error) {
    console.error('Error processing answer:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error processing answer',
      details: error.message 
    });
  }
};

const getDefaultAnalysis = () => ({
  score: 5,
  feedback: "Error analyzing answer. Please try again.",
  technicalAccuracy: 5,
  completeness: 5,
  clarity: 5
});

const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid answers format',
        details: 'Answers must be provided as an array'
      });
    }

    // Generate final evaluation
    const evaluation = await geminiService.generateFinalEvaluation(answers);
    
    // Store evaluation in database if needed
    // await storeEvaluation(interviewId, evaluation);

    res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    console.error('Error ending interview:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate final evaluation',
      details: error.message 
    });
  }
};

const getNextQuestion = async (req, res) => {
  try {
    const { interviewId, currentTopic, selectedSkills, questionNumber } = req.body;

    // Convert selectedSkills object to array of skills
    const skillsArray = Object.entries(selectedSkills)
      .reduce((acc, [category, skills]) => {
        return acc.concat(skills);
      }, []);

    // Filter out current topic
    const availableSkills = skillsArray.filter(skill => skill !== currentTopic);
    
    // If no other skills available, reuse current topic
    const nextTopic = availableSkills.length > 0 
      ? availableSkills[Math.floor(Math.random() * availableSkills.length)]
      : currentTopic;

    // Generate new question using Gemini
    const nextQuestion = await geminiService.generateQuestion(nextTopic);

    res.json({
      nextQuestion,
      nextTopic,
      questionNumber
    });
  } catch (error) {
    console.error('Error getting next question:', error);
    res.status(500).json({ error: 'Failed to get next question' });
  }
};

const submitAllAnswers = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const audioFiles = req.files;
    const interview = activeInterviews.get(interviewId);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Process all answers in parallel
    const analysisPromises = audioFiles.map(async (file, index) => {
      const transcript = await speechToTextService.convertSpeechToText(file.buffer);
      const question = req.body[`question${index}`];
      const topic = req.body[`topic${index}`];
      
      const analysis = await geminiService.analyzeAnswer(transcript, { question, topic });
      return {
        question,
        topic,
        transcript,
        score: analysis.technicalAccuracy,
        feedback: analysis.feedback
      };
    });

    const results = await Promise.all(analysisPromises);

    // Calculate final scores
    const topicScores = {};
    results.forEach(result => {
      if (!topicScores[result.topic]) {
        topicScores[result.topic] = [];
      }
      topicScores[result.topic].push(result.score);
    });

    const finalResults = {
      overallScore: results.reduce((acc, r) => acc + r.score, 0) / results.length,
      topicWiseScores: Object.entries(topicScores).reduce((acc, [topic, scores]) => {
        acc[topic] = scores.reduce((a, b) => a + b, 0) / scores.length;
        return acc;
      }, {}),
      detailedFeedback: results
    };

    res.json(finalResults);
  } catch (error) {
    console.error('Error processing answers:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new interview
const createInterview = async (req, res) => {
  try {
    const {
      name,
      roles,
      skills,
      difficulty,
      numQuestions,
      date,
      time,
      duration,
      description
    } = req.body;

    // Convert the string ID to ObjectId
    const companyId = new mongoose.Types.ObjectId(req.user._id);

    const interview = new Interview({
      companyId,
      name,
      roles,
      skills,
      difficulty,
      numQuestions,
      date,
      time,
      duration,
      description,
      candidates: [] // Initialize empty candidates array
    });

    await interview.save();
    res.status(201).json({
      success: true,
      interview
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create interview',
      details: error.message
    });
  }
};

// Upload candidates from Excel
const uploadCandidates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const workbook = xlsx.read(req.file.buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Excel file is empty'
      });
    }

    // Get the first row to detect column names
    const firstRow = data[0];
    const columnNames = Object.keys(firstRow);

    // Function to find column by possible names
    const findColumn = (possibleNames) => {
      return columnNames.find(col => 
        possibleNames.some(name => {
          const cleanCol = col.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return cleanCol.includes(cleanName) || cleanName.includes(cleanCol);
        })
      );
    };

    // Find required columns with expanded possible matches
    const emailColumn = findColumn([
      'email', 'emailaddress', 'mail', 'email address', 'emailid', 'personalemail', 'collegeemail',
      'student email', 'candidate email', 'primary email'
    ]);
    const nameColumn = findColumn([
      'name', 'fullname', 'studentname', 'candidatename', 'student full name', 'studentfullname',
      'full name', 'candidate full name', 'complete name'
    ]);
    const phoneColumn = findColumn([
      'phone', 'mobile', 'contact', 'phonenumber', 'mobilenumber', 'contactnumber', 'phone number',
      'mobile number', 'contact number', 'student phone', 'candidate phone'
    ]);

    if (!emailColumn || !nameColumn || !phoneColumn) {
      return res.status(400).json({
        success: false,
        error: 'Required columns not found in the Excel file.',
        details: {
          missingColumns: {
            email: !emailColumn ? 'Email Address column not found' : null,
            name: !nameColumn ? 'Full Name column not found' : null,
            phone: !phoneColumn ? 'Phone Number column not found' : null
          },
          expectedColumns: [
            'Email Address or similar (e.g., Student Email, Email ID)',
            'Full Name or similar (e.g., Student Full Name, Candidate Name)',
            'Phone Number or similar (e.g., Mobile Number, Contact)'
          ],
          foundColumns: columnNames
        },
        message: 'Please ensure your Excel file has columns for Email Address, Full Name, and Phone Number. You can download a template for the correct format.'
      });
    }

    const interviewId = req.params.interviewId;
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }

    const candidates = [];
    const codes = new Set();
    const errors = [];
    const processedEmails = new Set(); // To track duplicate emails

    for (const row of data) {
      // Clean and validate the data
      const email = (row[emailColumn]?.toString() || '').trim().toLowerCase();
      const name = (row[nameColumn]?.toString() || '').trim();
      const phone = (row[phoneColumn]?.toString() || '').trim()
        .replace(/[^0-9+]/g, ''); // Keep only numbers and + sign

      // Skip empty rows
      if (!email && !name && !phone) {
        continue;
      }

      // Validate required fields
      if (!email || !name || !phone) {
        errors.push(`Missing required fields for row: ${JSON.stringify(row)}`);
        continue;
      }

      // Skip duplicate emails
      if (processedEmails.has(email)) {
        errors.push(`Duplicate email found: ${email}`);
        continue;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push(`Invalid email format: ${email}`);
        continue;
      }

      // Validate phone number (must be at least 10 digits)
      if (phone.replace(/[^0-9]/g, '').length < 10) {
        errors.push(`Invalid phone number for ${name}: ${phone}`);
        continue;
      }

      processedEmails.add(email);

      // Generate unique code for each candidate
      let code;
      do {
        code = uuidv4().substring(0, 8).toUpperCase();
      } while (codes.has(code));
      codes.add(code);

      try {
        // Create or update candidate
        let candidate = await Candidate.findOne({ email });
        if (!candidate) {
          candidate = new Candidate({
            name,
            email,
            mobile: phone
          });
        }

        // Add interview to candidate's interviews array
        candidate.interviews.push({
          interviewId,
          code,
          status: 'pending'
        });

        await candidate.save();

        // Add candidate to interview's candidates array
        interview.candidates.push({
          candidateId: candidate._id,
          code,
          status: 'pending'
        });

        candidates.push({
          name,
          email,
          mobile: phone,
          code
        });
      } catch (error) {
        errors.push(`Error processing candidate ${email}: ${error.message}`);
      }
    }

    await interview.save();

    res.status(200).json({
      success: true,
      candidates,
      message: `Successfully processed ${candidates.length} candidates`,
      totalProcessed: candidates.length,
      totalErrors: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error uploading candidates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload candidates',
      details: error.message
    });
  }
};

// Get all interviews for a company
const getCompanyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ companyId: req.user._id })
      .populate('candidates.candidateId', 'name email mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      interviews
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch interviews'
    });
  }
};

// Get interview details
const getInterviewDetails = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidates.candidateId', 'name email mobile');

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    console.error('Error fetching interview details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch interview details'
    });
  }
};

// Add new controller method for face analysis
const analyzeFace = async (req, res) => {
  try {
    const { frame } = req.body;
    
    if (!frame) {
      return res.status(400).json({ 
        error: 'No frame data provided',
        faceDetected: false,
        confidenceScore: 0
      });
    }

    // Convert base64 frame to image data
    const imageData = Buffer.from(frame.split(',')[1], 'base64');
    
    // Analyze the frame using the face analysis service
    const analysis = await faceAnalysisService.analyzeFrame(imageData);
    
    res.json({
      faceDetected: analysis.faceDetected,
      confidenceScore: analysis.confidenceScore,
      warning: analysis.warning
    });
  } catch (error) {
    console.error('Face analysis error:', error);
    res.status(500).json({ 
      error: 'Error analyzing face',
      faceDetected: false,
      confidenceScore: 0,
      warning: 'Error processing facial analysis'
    });
  }
};

module.exports = {
  generateQuestions,
  analyzeAnswer,
  startInterview,
  getInterviewSession,
  processAnswer,
  endInterview,
  getNextQuestion,
  submitAllAnswers,
  createInterview,
  uploadCandidates,
  getCompanyInterviews,
  getInterviewDetails,
  analyzeFace
};
