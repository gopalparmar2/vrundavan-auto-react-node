import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import brandRoutes from './routes/brands.js';
import modelRoutes from './routes/models.js';
import inquiryRoutes from './routes/inquiries.js';
import estimateRoutes from './routes/estimates.js';
import dashboardRoutes from './routes/dashboard.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload directory if any
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vehicle Dealership API Server Running' });
});

// Connect Database & Start Server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vehicle_dealership';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB Database: vehicle_dealership`);
    app.listen(PORT, () => {
      console.log(`Backend Express server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  });
