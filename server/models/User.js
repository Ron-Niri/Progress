import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  resetPasswordCode: { type: String },
  resetPasswordExpires: { type: Date },
  profile: {
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  preferences: {
    darkMode: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    habitReminders: { type: Boolean, default: true },
    goalReminders: { type: Boolean, default: true },
    gamificationEnabled: { type: Boolean, default: true },
    reminderDaysBefore: { type: Number, default: 3 } // Days before deadline to send reminder
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
