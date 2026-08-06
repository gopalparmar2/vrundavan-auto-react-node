import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUploadDir = path.join(__dirname, '../uploads');

// Ensure base upload sub-directories exist
['users', 'brands', 'models'].forEach((subFolder) => {
  const dir = path.join(baseUploadDir, subFolder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rawType = (req.params.type || req.query.type || req.body.type || 'brands').toLowerCase();
    const type = ['users', 'brands', 'models'].includes(rawType) ? rawType : 'brands';
    const targetDir = path.join(baseUploadDir, type);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    req.uploadSubFolder = type;
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const prefix = req.uploadSubFolder ? req.uploadSubFolder.slice(0, -1) : 'img';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

const handleUploadResponse = (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No image file uploaded', 400);
    }
    const folder = req.uploadSubFolder || 'brands';
    const filename = req.file.filename;
    const baseUrl = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const url = `${baseUrl}/uploads/${folder}/${filename}`;

    return sendSuccess(res, { filename, url, folder }, 'Image uploaded successfully');
  } catch (err) {
    return sendError(res, err.message || 'Image upload failed', 500);
  }
};

router.post('/:type', protect, upload.single('image'), handleUploadResponse);
router.post('/', protect, upload.single('image'), handleUploadResponse);

export default router;
