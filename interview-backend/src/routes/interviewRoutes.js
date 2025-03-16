// src/routes/interviewRoutes.js

const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const geminiService = require('../services/geminiService');
const questionService = require('../services/questionService');

// Start new interview
router.post('/start', async (req, res) => {
  try {
    const { interviewCode, skills } = req.body;
    console.log('Starting interview with skills:', skills);

    // Generate first question for each skill (total 5 questions)
    const questions = [];
    const totalQuestions = 5;
    const skillsArray = skills.length >= totalQuestions 
      ? skills.slice(0, totalQuestions) 
      : [...skills, ...Array(totalQuestions - skills.length).fill(skills[0])];

    for (let i = 0; i < totalQuestions; i++) {
      const question = await geminiService.generateQuestion(
        skillsArray[i], 
        questions.map(q => q.question)
      );
      questions.push({
        ...question,
        id: Math.random().toString(36).substr(2, 9),
        skill: skillsArray[i],
        questionNumber: i + 1
      });
    }

    const interview = {
      id: interviewCode,
      skills: skillsArray,
      status: 'active',
      startTime: new Date(),
      currentQuestionIndex: 0,
      totalQuestions: totalQuestions,
      questions: questions,
      answers: []
    };

    console.log('Interview initialized:', interview);

    res.json({ 
      success: true, 
      interview,
      message: 'Interview started successfully'
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to start interview',
      details: error.message
    });
  }
});

// Get questions based on selected skills
router.get('/:id/questions', (req, res) => {
  try {
    const interviewCode = req.params.id;
    const session = interviewController.getInterviewSession(interviewCode);
    
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    console.log('Sending questions for session:', session.id);
    res.json(session.questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

// Evaluate answer using Gemini
router.post('/evaluate-answer', async (req, res) => {
  try {
    const { answer, question, interviewCode } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const evaluation = await geminiService.analyzeAnswer(answer, question);
    
    res.json({
      evaluation,
      nextQuestion: null // The next question will be handled by the frontend
    });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ 
      error: 'Error evaluating answer',
      details: error.message
    });
  }
});

// Generate final evaluation
router.post('/final-evaluation', async (req, res) => {
  try {
    const { answers } = req.body;
    const finalEvaluation = await geminiService.generateFinalEvaluation(answers);
    res.json(finalEvaluation);
  } catch (error) {
    console.error('Error generating final evaluation:', error);
    res.status(500).json({ error: 'Error generating final evaluation' });
  }
});

// Save interview results
router.post('/:id/results', (req, res) => {
  try {
    // Handle saving results
    res.json({ message: 'Results saved successfully' });
  } catch (error) {
    console.error('Error saving results:', error);
    res.status(500).json({ error: 'Error saving results' });
  }
});

// Get interview results
router.get('/:id/results', (req, res) => {
  try {
    // Handle getting results
    res.json({ message: 'Results retrieved successfully' });
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: 'Error getting results' });
  }
});

module.exports = router;
