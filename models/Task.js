const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
      type: String, // 'daily', 'long-term'
      default: 'daily'
  }
});

module.exports = mongoose.model('Task', TaskSchema);
