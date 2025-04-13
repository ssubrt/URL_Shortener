import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import linkRoutes from './routes/link.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// const corsOptions = {
//   origin: process.env.VITE_API_URL || 'https://url-shortener-rho-wheat.vercel.app',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true, 
// };
// app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/auth', authRoutes);
app.use('/links', linkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});