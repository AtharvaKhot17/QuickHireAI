const { GoogleGenerativeAI } = require("@google/generative-ai");

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-001" });

const getFallbackQuestion = (skill, previousQuestions = []) => {
  const skillSpecificQuestions = {
    'C++': [
      'Explain the difference between stack and heap memory in C++.',
      'How do you handle memory management in C++?',
      'What are smart pointers and how do they help prevent memory leaks?',
      'Explain the concept of RAII in C++.',
      'How do you implement polymorphism in C++?'
    ],
    'MongoDB': [
      'Explain the difference between MongoDB and traditional SQL databases.',
      'How do you design a schema in MongoDB?',
      'What are MongoDB indexes and how do they improve performance?',
      'Explain the concept of sharding in MongoDB.',
      'How do you handle transactions in MongoDB?'
    ],
    'TypeScript': [
      'Explain the benefits of using TypeScript over JavaScript.',
      'How do you handle type definitions in TypeScript?',
      'What are generics in TypeScript and when would you use them?',
      'Explain the concept of interfaces in TypeScript.',
      'How do you handle type checking in TypeScript?'
    ]
  };

  // Get skill-specific questions or use generic ones
  const questions = skillSpecificQuestions[skill] || [
    `Explain the core concepts of ${skill} and their practical applications.`,
    `What are the best practices you follow when working with ${skill}?`,
    `Describe a challenging problem you've solved using ${skill}.`,
    `Compare and contrast different approaches in ${skill}.`,
    `What are the common pitfalls to avoid when working with ${skill}?`
  ];

  // Filter out previously used questions
  const unusedQuestions = questions.filter(q => 
    !previousQuestions.some(prevQ => calculateSimilarity(prevQ, q) > 0.7)
  );

  // If all questions are used, create a variation
  const question = unusedQuestions.length > 0 
    ? unusedQuestions[0]
    : `Tell me about your experience with ${skill} and any recent projects.`;

  return {
    question,
    topic: skill,
    difficulty: "medium",
    expectedDuration: "2-3 minutes",
    category: "experience",
    expectedKeyPoints: ["Technical knowledge", "Practical experience", "Challenges faced"],
    id: Math.random().toString(36).substring(2, 10),
    skill,
    questionNumber: previousQuestions.length + 1
  };
};

const generateQuestion = async (skill, previousQuestions = []) => {
  try {
    console.log('Generating question for skill:', skill);
    console.log('Previous questions:', previousQuestions);

    const prompt = `Generate a unique technical interview question for ${skill} that:
    1. Tests fundamental understanding
    2. Should be answerable verbally in 1-2 minutes
    3. Focuses on concepts that can be easily explained verbally
    4. Is suitable for entry to beginner-mid-level developers
    5. Avoids questions requiring detailed code implementation
    6. Must be COMPLETELY DIFFERENT from these previous questions: ${previousQuestions.join(', ')}
    
    The question should be conversation-friendly and encourage discussion rather than requiring specific code syntax or complex technical details.
    
    Return only the JSON object without markdown:
    {
      "question": "brief, clear question that can be answered verbally (max 2 sentences)",
      "topic": "specific topic within ${skill}",
      "difficulty": "easy or medium",
      "expectedDuration": "1-2 minutes",
      "category": "fundamentals/concepts/principles",
      "expectedKeyPoints": ["2-3 key discussion points"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text
    const jsonStr = text.replace(/```json\n|\n```|```/g, '').trim();
    
    try {
      const question = JSON.parse(jsonStr);
      
      // Validate required fields
      if (!question.question || !question.topic || !question.difficulty) {
        throw new Error('Invalid question format');
      }

      // Check if question is too similar to previous questions
      const isDuplicate = previousQuestions.some(prevQ => {
        const similarity = calculateSimilarity(prevQ, question.question);
        return similarity > 0.7; // 70% similarity threshold
      });

      if (isDuplicate) {
        console.log('Duplicate question detected, generating alternative');
        return getFallbackQuestion(skill, previousQuestions);
      }

      return question;
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      return getFallbackQuestion(skill, previousQuestions);
    }
  } catch (error) {
    console.error('Error generating question:', error);
    return getFallbackQuestion(skill, previousQuestions);
  }
};

// Add a simple similarity check function
const calculateSimilarity = (str1, str2) => {
  const words1 = str1.toLowerCase().split(/\W+/);
  const words2 = str2.toLowerCase().split(/\W+/);
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
};

const analyzeAnswer = async (answer, question) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not set, using default evaluation');
      return getDefaultEvaluation(answer, question);
    }

    const prompt = `Evaluate this interview answer:
    Question: ${question}
    Answer: ${answer}
    
    Provide a detailed evaluation in this JSON format:
    {
      "score": number between 0-10,
      "feedback": "detailed feedback on the answer",
      "technicalAccuracy": number between 0-10,
      "communication": number between 0-10,
      "improvements": ["specific areas for improvement"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text
    const jsonStr = text.replace(/```json\n|\n```|```/g, '').trim();
    
    try {
      const evaluation = JSON.parse(jsonStr);
      
      // Validate required fields
      if (!evaluation.score || !evaluation.feedback) {
        throw new Error('Invalid evaluation format');
      }

      return evaluation;
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      return getDefaultEvaluation(answer, question);
    }
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return getDefaultEvaluation(answer, question);
  }
};

const getDefaultEvaluation = (answer, question) => {
  // Skip if answer is empty or "Question skipped"
  if (!answer || answer.toLowerCase().includes('skipped')) {
    return {
      score: 0,
      feedback: 'Question was skipped',
      technicalAccuracy: 0,
      communication: 0,
      improvements: ['Please provide a detailed answer']
    };
  }

  // Basic evaluation based on answer length and content
  const answerLength = answer.length;
  const hasTechnicalTerms = /(function|class|method|variable|loop|condition|algorithm|data structure|database|api|framework)/i.test(answer);
  
  return {
    score: Math.min(5 + (answerLength / 100), 10),
    feedback: hasTechnicalTerms ? 'Answer shows some technical understanding' : 'Answer needs more technical depth',
    technicalAccuracy: hasTechnicalTerms ? 5 : 3,
    communication: Math.min(5 + (answerLength / 200), 10),
    improvements: [
      'Provide more specific examples',
      'Explain technical concepts in more detail',
      'Structure your answer with clear points'
    ]
  };
};

const createDefaultEvaluation = () => {
  return {
    scores: {
      technicalAccuracy: 5,
      communicationClarity: 5,
      problemSolvingApproach: 5,
      completeness: 5
    },
    feedback: {
      strengths: ["Unable to analyze strengths"],
      improvements: ["Unable to analyze improvements"],
      detailedFeedback: "Unable to generate detailed feedback"
    },
    overallScore: 5,
    skillAssessment: {
      technicalKnowledge: 5,
      communicationSkills: 5,
      problemSolving: 5
    }
  };
};

const generateFinalEvaluation = async (answers) => {
  try {
    // Check if all questions were skipped
    const allSkipped = answers.every(answer => !answer.answer || answer.answer.trim() === '');
    
    if (allSkipped) {
      return {
        overallScore: 0,
        skillAssessment: {
          technicalKnowledge: 0,
          communicationSkills: 0,
          problemSolving: 0,
          codingAbility: 0
        },
        strengths: ["No strengths to evaluate - all questions were skipped"],
        areasForImprovement: ["Please attempt to answer the questions to receive a proper evaluation"]
      };
    }

    // Calculate weighted scores
    const technicalWeight = 0.6; // 60% weight for technical aspects
    const communicationWeight = 0.2; // 20% weight for communication
    const problemSolvingWeight = 0.2; // 20% weight for problem solving

    // Calculate average scores for each category
    const technicalScores = answers.map(a => a.evaluation?.technicalAccuracy || 0);
    const communicationScores = answers.map(a => a.evaluation?.communication || 0);
    const problemSolvingScores = answers.map(a => a.evaluation?.score || 0);

    const avgTechnicalScore = technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length;
    const avgCommunicationScore = communicationScores.reduce((a, b) => a + b, 0) / communicationScores.length;
    const avgProblemSolvingScore = problemSolvingScores.reduce((a, b) => a + b, 0) / problemSolvingScores.length;

    // Calculate weighted overall score
    const overallScore = (
      (avgTechnicalScore * technicalWeight) +
      (avgCommunicationScore * communicationWeight) +
      (avgProblemSolvingScore * problemSolvingWeight)
    );

    // Generate detailed feedback
    const prompt = `Based on these interview answers and their evaluations:
    ${answers.map((a, i) => `
    Question ${i + 1}: ${a.question}
    Answer: ${a.answer}
    Technical Score: ${a.evaluation?.technicalAccuracy || 0}/10
    Communication Score: ${a.evaluation?.communication || 0}/10
    Feedback: ${a.evaluation?.feedback || 'No feedback available'}
    `).join('\n')}
    
    Provide a comprehensive final evaluation in this JSON format:
    {
      "overallScore": number between 0-10,
      "skillAssessment": {
        "technicalKnowledge": number between 0-10,
        "communicationSkills": number between 0-10,
        "problemSolving": number between 0-10
      },
      "strengths": ["list of key strengths"],
      "areasForImprovement": ["list of areas needing improvement"],
      "careerReadiness": {
        "level": "entry/mid/senior",
        "recommendation": "specific career advice"
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text
    const jsonStr = text.replace(/```json\n|\n```|```/g, '').trim();
    
    try {
      const evaluation = JSON.parse(jsonStr);
      
      // Override the overall score with our weighted calculation
      evaluation.overallScore = overallScore;
      
      // Ensure skill assessment reflects the weighted scores
      evaluation.skillAssessment = {
        technicalKnowledge: avgTechnicalScore,
        communicationSkills: avgCommunicationScore,
        problemSolving: avgProblemSolvingScore
      };

      return evaluation;
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      return createDefaultFinalEvaluation(answers);
    }
  } catch (error) {
    console.error('Error generating final evaluation:', error);
    return createDefaultFinalEvaluation(answers);
  }
};

const createDefaultFinalEvaluation = (answers) => {
  return {
    overallScore: 5,
    skillAssessment: {
      technicalKnowledge: 5,
      communicationSkills: 5,
      problemSolving: 5,
      codingAbility: 5
    },
    strengths: ["Unable to analyze strengths"],
    areasForImprovement: ["Unable to analyze areas for improvement"],
    feedback: "Unable to generate final feedback",
    careerReadiness: {
      level: "Unable to determine",
      recommendation: "Unable to generate recommendation"
    },
    questionAnalysis: answers.map((_, i) => ({
      questionNumber: i + 1,
      performance: "Unable to analyze performance",
      score: 5
    })),
    answers: answers
  };
};

const calculateAverageScore = (answers) => {
  const scores = answers.map(a => a.score || 0);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

const generateRecommendations = (evaluation) => {
  const recommendations = [];
  const score = evaluation.overallScore;

  if (score < 6) {
    recommendations.push(
      "Focus on strengthening fundamental concepts",
      "Practice coding problems regularly",
      "Review basic data structures and algorithms"
    );
  } else if (score < 8) {
    recommendations.push(
      "Work on problem-solving techniques",
      "Practice explaining technical concepts",
      "Focus on code optimization and best practices"
    );
  } else {
    recommendations.push(
      "Explore advanced topics in your strong areas",
      "Consider contributing to open source",
      "Practice system design and architecture"
    );
  }

  return recommendations;
};

const generateOverallFeedback = (evaluation) => {
  const score = evaluation.overallScore;
  let feedback = `Overall Performance: ${score}/10. `;

  if (score >= 8) {
    feedback += "Excellent performance across all areas. ";
  } else if (score >= 6) {
    feedback += "Good performance with room for improvement. ";
  } else {
    feedback += "Needs significant improvement in core areas. ";
  }

  // Add skill-specific feedback
  Object.entries(evaluation.skillBreakdown).forEach(([skill, score]) => {
    feedback += `${skill}: ${score}/10. `;
  });

  return feedback;
};

module.exports = {
  generateQuestion,
  analyzeAnswer,
  generateFinalEvaluation,
};