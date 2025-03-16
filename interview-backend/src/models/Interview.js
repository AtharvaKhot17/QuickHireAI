const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'in-progress', 'completed'],
    default: 'active'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  startTime: Date,
  endTime: Date,
  // Add any other fields you need
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema); 