const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const getFallbackQuestion = (skill) => {
  const questions = {
    javascript: {
      question: "What is the difference between let, const, and var in JavaScript?",
      topic: "JavaScript Basics",
      difficulty: "easy",
      expectedDuration: "1-2 minutes",
      category: "fundamentals",
      expectedKeyPoints: ["Block scope vs function scope", "Hoisting behavior", "Reassignment rules"]
    },
    react: {
      question: "Compare class components and functional components in React. When would you choose one over the other?",
      topic: "React",
      difficulty: "medium",
      expectedDuration: "2-3 minutes",
      category: "conceptual",
      context: "React component patterns"
    },
    python: {
      question: "Explain Python's list comprehensions and when you should or shouldn't use them.",
      topic: "Python",
      difficulty: "medium",
      expectedDuration: "2-3 minutes",
      category: "best practices",
      context: "Python coding patterns"
    },
    "system design": {
      question: "Explain the key considerations when designing a caching system for a web application.",
      topic: "System Design",
      difficulty: "medium",
      expectedDuration: "2-3 minutes",
      category: "architectural",
      context: "Web application architecture"
    }
  };

  return questions[skill.toLowerCase()] || {
    question: `Explain the most important principles or best practices you follow when working with ${skill}.`,
    topic: skill,
    difficulty: "medium",
    expectedDuration: "2-3 minutes",
    category: "best practices",
    context: "General principles discussion"
  };
};

const generateQuestion = async (skill, previousQuestions = []) => {
  try {
    const prompt = `Generate a concise technical interview question for ${skill} that:
    1. Tests fundamental understanding
    2. Should be answerable verbally in 1-2 minutes
    3. Focuses on concepts that can be easily explained verbally
    4. Is suitable for entry to beginner-mid-level developers
    5. Avoids questions requiring detailed code implementation
    6. Must be different from: ${previousQuestions.join(', ')}
    
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
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      return getFallbackQuestion(skill);
    }
  } catch (error) {
    console.error('Error generating question:', error);
    return getFallbackQuestion(skill);
  }
};

const analyzeAnswer = async (answer, question) => {
  try {
    const prompt = `Evaluate this technical interview answer:
    Question: ${question.question}
    Answer: ${answer || '[No answer provided]'}
    Expected Key Points: ${question.expectedKeyPoints?.join(', ')}
    
    Return only the JSON object without any markdown formatting or code blocks:
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
    
    // Remove any markdown formatting
    const jsonStr = text.replace(/```json\n|\n```|```/g, '').trim();
    
    try {
      return JSON.parse(jsonStr);
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