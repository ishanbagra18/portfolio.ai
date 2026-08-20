import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import templateRoutes from './routes/templateRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Ensure uploads folder exists
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/', { recursive: true });
}

// CORS Configuration
const origins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://portfolio-ai-lyart.vercel.app',
  'https://portfolio-ai-gzyo.onrender.com'
];

if (process.env.FRONTEND_URL) {
  origins.push(process.env.FRONTEND_URL);
  origins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}

// Private Network Access (PNA) Preflight CORS support
app.use((req, res, next) => {
  if (req.headers['access-control-request-private-network']) {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  }
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const cleanOrigin = origin.replace(/\/$/, '');
      const isAllowed = origins.some(allowed => allowed.replace(/\/$/, '') === cleanOrigin)
        || cleanOrigin.endsWith('.vercel.app')
        || cleanOrigin.endsWith('.onrender.com')
        || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/templates', templateRoutes);

// Multi-path static frontend serving for full-stack Render deployments
const candidateDistPaths = [
  path.join(__dirname, '../../frontend/vite-project/dist'),
  path.join(process.cwd(), 'frontend/vite-project/dist'),
  path.join(process.cwd(), '../frontend/vite-project/dist'),
  path.join(process.cwd(), 'dist')
];

const frontendDistPath = candidateDistPaths.find(p => fs.existsSync(p));
if (frontendDistPath) {
  console.log(`Serving static frontend build from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  console.log('No frontend dist build folder found. Running in API mode.');
}

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});