import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const app = express();
app.use(cors());


router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      user: { id: user._id, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      user: { id: user._id, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

export default router;