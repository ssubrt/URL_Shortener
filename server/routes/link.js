import express from 'express';
import cors from 'cors';
import { auth } from '../middleware/auth.js';
import Link from '../models/Link.js';

const app = express();
app.use(cors());
const router = express.Router();

// Get user's links with pagination and search
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = {
      userId: req.userId,
      $or: [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortUrl: { $regex: search, $options: 'i' } },
        { alias: { $regex: search, $options: 'i' } }
      ]
    };

    const [links, total] = await Promise.all([
      Link.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Link.countDocuments(query)
    ]);

    res.json({
      links,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalLinks: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching links' });
  }
});

// Create new link
router.post('/', auth, async (req, res) => {
  try {
    const { originalUrl, alias, expiresAt } = req.body;
    const shortUrl = alias || Math.random().toString(36).substring(2, 8);

    const link = new Link({
      userId: req.userId,
      originalUrl,
      shortUrl,
      alias,
      expiresAt,
      clicks: 0
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error creating link' });
  }
});

// Redirect and track clicks
router.get('/:shortUrl', async (req, res) => {
  try {
    const link = await Link.findOne({ shortUrl: req.params.shortUrl });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(410).json({ message: 'Link has expired' });
    }

    // Increment clicks
    link.clicks += 1;
    await link.save();

    res.redirect(link.originalUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error redirecting to link' });
  }
});

export default router;