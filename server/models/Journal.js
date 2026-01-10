import mongoose from 'mongoose';

const JournalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  mood: { type: String, enum: ['great', 'good', 'neutral', 'bad', 'terrible'], default: 'neutral' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Journal', JournalSchema);
