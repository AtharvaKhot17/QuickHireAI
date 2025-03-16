// src/controllers/interviewController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const uuid = require('uuid');

const questionService = require('../services/questionService');
// Remove this line since we're not using backend speech-to-text
// const speechToTextService = require('../services/speechToTextService');
const geminiService = require('../services/geminiService');
const faceAnalysis = require('../services/faceAnalysisService');
const voiceAnalysis = require('../services/voiceAnalysisService');
const { INTERVIEW_TOPICS } = require('../services/geminiService');

// Store ongoing interviews in memory (in production, use a database)
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
      videoData ? faceAnalysis.analyze(videoData) : null
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

const startInterview = async (interviewCode, skills) => {
  try {
    console.log('Starting interview in controller:', { interviewCode, skills });
    
    // Initialize Map if not exists
    const interviews = initializeActiveInterviews();

    // Initialize interview session with default questions
    const interviewSession = {
      id: interviewCode,
      skills: skills,
      status: 'active',
      startTime: new Date(),
      currentSkillIndex: 0,
      selectedSkills: skills.map(skill => ({ skill })),
      answers: [],
      questions: []  // We'll populate this with generated questions
    };

    // Generate initial questions for each skill
    for (const skill of skills) {
      try {
        const question = await geminiService.generateQuestion(skill);
        interviewSession.questions.push({
          ...question,
          skill: skill,
          topic: skill,
          id: Math.random().toString(36).substr(2, 9)
        });
      } catch (error) {
        console.error('Error generating question for skill:', skill, error);
        // Fallback question if generation fails
        interviewSession.questions.push({
          id: Math.random().toString(36).substr(2, 9),
          question: `Tell me about your experience with ${skill}`,
          type: "technical",
          skill: skill,
          topic: skill,
          difficulty: "medium",
          category: "experience",
          context: `Understanding ${skill} background`
        });
      }
    }

    // Log the created session
    console.log('Interview session created:', interviewSession);

    // Store the session
    interviews.set(interviewCode, interviewSession);
    console.log('Active interviews:', interviews.size);

    return interviewSession;
  } catch (error) {
    console.error('Error in startInterview controller:', error);
    throw new Error(`Failed to start interview: ${error.message}`);
  }
};

const getInterviewSession = (interviewCode) => {
  const interviews = initializeActiveInterviews();
  const session = interviews.get(interviewCode);
  if (!session) {
    throw new Error('Interview session not found');
  }
  return session;
};

const processAnswer = async (req, res) => {
  try {
    const { interviewId, transcript, currentQuestion, code, skipped } = req.body;
    console.log('Processing answer:', { interviewId, transcript, currentQuestion });

    const interview = activeInterviews.get(interviewId);

    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found' });
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
      analysis = {
        score: 5,
        feedback: "Error analyzing answer. Please try again.",
        technicalAccuracy: 5,
        completeness: 5,
        clarity: 5
      };
    }

    // Store answer and analysis
    interview.answers.push({
      question: currentQuestion,
      answer: transcript,
      code: code,
      analysis: analysis
    });

    // Calculate running average
    const totalScore = interview.answers.reduce((sum, ans) => sum + (ans.analysis?.score || 0), 0);
    interview.currentScore = totalScore / interview.answers.length;

    // Get next skill
    interview.currentSkillIndex = (interview.currentSkillIndex + 1) % interview.selectedSkills.length;
    const nextSkill = interview.selectedSkills[interview.currentSkillIndex];
    
    // Generate next question
    let nextQuestion;
    try {
      nextQuestion = await geminiService.generateQuestion(nextSkill.skill);
    } catch (questionError) {
      console.error('Error generating next question:', questionError);
      nextQuestion = {
        question: `Tell me about your experience with ${nextSkill.skill}`,
        topic: nextSkill.skill,
        difficulty: "medium"
      };
    }

    res.json({
      score: analysis.score,
      feedback: analysis.feedback,
      technicalAccuracy: analysis.technicalAccuracy,
      completeness: analysis.completeness,
      clarity: analysis.clarity,
      codeQuality: analysis.codeQuality,
      improvements: analysis.improvements,
      nextQuestion,
      nextTopic: nextSkill.skill,
      currentScore: interview.currentScore
    });

  } catch (error) {
    console.error('Error processing answer:', error);
    res.status(500).json({ 
      error: 'Error processing answer',
      details: error.message 
    });
  }
};

const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { answers } = req.body;

    // Generate final evaluation
    const evaluation = await geminiService.generateFinalEvaluation(answers);
    
    // Store evaluation in database if needed
    // await storeEvaluation(interviewId, evaluation);

    res.json({
      status: 'completed',
      evaluation
    });
  } catch (error) {
    console.error('Error ending interview:', error);
    res.status(500).json({ 
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

module.exports = {
  generateQuestions,
  analyzeAnswer,
  startInterview,
  getInterviewSession,
  processAnswer,
  endInterview,
  getNextQuestion,
  submitAllAnswers
};
