import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['first_habit', 'week_streak', 'month_streak', 'first_goal', 'goal_completed', 'journal_entry', 'perfect_week'],
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: '🏆' },
  isShared: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Achievement', AchievementSchema);
