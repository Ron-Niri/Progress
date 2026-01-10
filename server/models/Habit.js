import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  streak: { type: Number, default: 0 },
  completedDates: [{ type: Date }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Habit', HabitSchema);
