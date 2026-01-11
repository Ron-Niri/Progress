import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetDate: { type: Date },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  progress: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  subGoals: [{
    title: { type: String },
    completed: { type: Boolean, default: false }
  }],
  milestones: [{
    title: { type: String },
    date: { type: Date },
    completed: { type: Boolean, default: false }
  }],
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachments: [{
    url: { type: String },
    name: { type: String },
    type: { type: String }
  }],
  reminderSent: { type: Boolean, default: false },
  lastReminderDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Goal', GoalSchema);
