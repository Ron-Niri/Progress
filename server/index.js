import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import goalRoutes from './routes/goals.js';
import journalRoutes from './routes/journal.js';
import statsRoutes from './routes/stats.js';
import profileRoutes from './routes/profile.js';
import achievementsRoutes from './routes/achievements.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/achievements', achievementsRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Progress API is running', status: 'OK' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    // Only serve index.html if it's not an API route
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    }
  });
}

// Database Connection
const connectDB = async () => {
    console.log('🔌 Attempting to connect to MongoDB...');
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI is not defined in .env file');
        return;
    }
    console.log('📝 Using URI:', uri.split('@').pop()); // Log only the host part for security
    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
    }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
