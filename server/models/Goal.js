import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetDate: { type: Date },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  progress: { type: Number, default: 0 }, // 0 to 100
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Goal', GoalSchema);
