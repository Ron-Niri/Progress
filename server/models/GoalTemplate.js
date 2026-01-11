import mongoose from 'mongoose';

const GoalTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'General' },
  icon: { type: String, default: '🎯' },
  subGoals: [{
    title: { type: String }
  }],
  milestones: [{
    title: { type: String },
    relativeDays: { type: Number } // Days from start
  }]
});

export default mongoose.model('GoalTemplate', GoalTemplateSchema);
