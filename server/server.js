import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Serve static files (default images and uploads)
app.use('/default-images', express.static(path.join(__dirname, '..', 'client', 'public', 'default-images')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'client', 'public', 'uploads')));

// Multer config for image uploads
const uploadsDir = path.join(__dirname, '..', 'client', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `upload-${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files (jpg, png, webp) are allowed'));
  },
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);

// GET /api/images/defaults — list default images
app.get('/api/images/defaults', (req, res) => {
  const defaultImagesDir = path.join(__dirname, '..', 'client', 'public', 'default-images');
  try {
    const files = fs.readdirSync(defaultImagesDir).filter((f) =>
      /\.(jpg|jpeg|png|webp)$/i.test(f)
    );
    res.json({ images: files });
  } catch (err) {
    console.error('Error reading default images:', err);
    res.json({ images: [] });
  }
});

// POST /api/images/upload — upload custom image
app.post('/api/images/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  res.json({ imageId: req.file.filename, path: `/uploads/${req.file.filename}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum 5MB allowed.' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📁 Default images served from: ${path.join(__dirname, '..', 'client', 'public', 'default-images')}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n💡 Make sure MongoDB is running locally or update MONGODB_URI in .env');
    process.exit(1);
  });
