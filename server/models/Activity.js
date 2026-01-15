import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['habit_completed', 'goal_created', 'goal_completed', 'achievement_unlocked', 'level_up', 'collaboration_joined'],
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  metadata: {
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // ID of the habit, goal, or achievement
    icon: { type: String },
    value: { type: Number } // progress or streak
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Activity', ActivitySchema);
