const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  roles: [{
    type: String,
    required: true
  }],
  skills: {
    type: Object,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  numQuestions: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed'],
    default: 'scheduled'
  },
  candidates: [{
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    code: {
      type: String,
      sparse: true
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    scores: {
      technical: Number,
      confidence: Number,
      communication: Number
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Drop any existing unique index on candidates.code
interviewSchema.index({ 'candidates.code': 1 }, { unique: false, sparse: true });

// Ensure the model is properly initialized
const Interview = mongoose.model('Interview', interviewSchema);

// Drop the unique index if it exists
Interview.collection.dropIndex('candidates.code_1', function(err) {
  if (err) {
    console.log('Index drop error (may be normal if index doesn\'t exist):', err);
  }
});

module.exports = Interview; 