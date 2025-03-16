const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const getFallbackQuestion = (skill, previousQuestions = []) => {
  const fallbackQuestions = [
    `Explain the core concepts of ${skill} and their practical applications.`,
    `What are the best practices you follow when working with ${skill}?`,
    `Describe a challenging problem you've solved using ${skill}.`,
    `Compare and contrast different approaches in ${skill}.`,
    `What are the common pitfalls to avoid when working with ${skill}?`
  ];

  // Filter out previously used questions
  const unusedQuestions = fallbackQuestions.filter(q => 
    !previousQuestions.some(prevQ => calculateSimilarity(prevQ, q) > 0.7)
  );

  // If all fallback questions are used, create a variation
  const question = unusedQuestions.length > 0 
    ? unusedQuestions[0]
    : `Tell me about your experience with ${skill} and any recent projects.`;

  return {
    question,
    topic: skill,
    difficulty: "medium",
    expectedDuration: "2-3 minutes",
    category: "experience",
    expectedKeyPoints: ["Technical knowledge", "Practical experience", "Challenges faced"]
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
    
    const jsonStr = text.replace(/```json\n|\n```|```/g, '').trim();
    
    try {
      const question = JSON.parse(jsonStr);
      
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
    // Make sure we have the question text
    const questionText = typeof question === 'string' ? question : 
                        question.question || 'Unknown question';
    
    console.log('Analyzing answer:', { questionText, answer });

    const prompt = `Evaluate this technical interview answer:
    Question: ${questionText}
    Answer: ${answer || '[No answer provided]'}
    
    Return only the JSON object without any markdown formatting:
    {
      "score": (1-10),
      "feedback": "detailed constructive feedback",
      "technicalAccuracy": (1-10),
      "communication": (1-10),
      "keyPointsCovered": ["covered points"],
      "missingPoints": ["missing points"],
      "improvements": ["specific improvement suggestions"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const evaluation = JSON.parse(text.replace(/```json\n|\n```|```/g, '').trim());
      console.log('Evaluation result:', evaluation);
      return evaluation;
    } catch (e) {
      console.error('Failed to parse evaluation:', e);
      return getDefaultEvaluation();
    }
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return getDefaultEvaluation();
  }
};

const getDefaultEvaluation = () => ({
  score: 5,
  feedback: "Unable to evaluate answer",
  technicalAccuracy: 5,
  communication: 5,
  improvements: ["Please provide a more detailed answer"]
});

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
        areasForImprovement: [
          "Attempt to answer interview questions",
          "Practice technical communication",
          "Build confidence in technical discussions"
        ],
        feedback: "No questions were attempted. Consider practicing with mock interviews to build confidence.",
        careerReadiness: {
          level: "Needs Practice",
          recommendation: "We recommend practicing with mock interviews and reviewing fundamental concepts before attempting another interview."
        },
        questionAnalysis: answers.map((_, i) => ({
          questionNumber: i + 1,
          performance: "Question was skipped",
          score: 0
        }))
      };
    }

    const prompt = `Analyze these interview answers and provide a comprehensive evaluation:

${answers.map((a, i) => `
Question ${i + 1}: ${a.question.question}
Answer: ${a.answer || 'Skipped'}
${a.code ? `Code: ${a.code}` : ''}
`).join('\n')}

Provide a final evaluation with these exact keys (no additional text or markdown):
{
  "overallScore": (number 0-10),
  "skillAssessment": {
    "technicalKnowledge": (number 0-10),
    "communicationSkills": (number 0-10),
    "problemSolving": (number 0-10),
    "codingAbility": (number 0-10)
  },
  "strengths": ["list of strengths"],
  "areasForImprovement": ["list of areas to improve"],
  "feedback": "detailed feedback string",
  "careerReadiness": {
    "level": "string indicating readiness level",
    "recommendation": "specific recommendation string"
  },
  "questionAnalysis": [
    {
      "questionNumber": 1,
      "performance": "brief performance description",
      "score": (number 0-10)
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure valid JSON
    const jsonStr = text.replace(/```json\n|\n```|```/g, '').trim();
    
    try {
      const evaluation = JSON.parse(jsonStr);
      return {
        ...evaluation,
        answers: answers.map(a => ({
          question: a.question.question,
          answer: a.answer || "Question was skipped",
          code: a.code,
          evaluation: a.evaluation || {
            score: 0,
            feedback: "Question was skipped",
            technicalAccuracy: 0,
            communication: 0
          }
        }))
      };
    } catch (error) {
      console.error("Error parsing evaluation JSON:", error);
      return createDefaultFinalEvaluation(answers);
    }
  } catch (error) {
    console.error("Error generating final evaluation:", error);
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