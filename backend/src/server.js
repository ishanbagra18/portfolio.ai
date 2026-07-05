import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js' // <-- Naya Import Added
import aiRoutes from './routes/aiRoutes.js'

import fs from 'fs'

const app = express()
const port = process.env.PORT || 5000

// Ensure uploads folder exists
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/', { recursive: true });
}

// CORS Configuration
const origins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://portfolio-ai-lyart.vercel.app'
];
if (process.env.FRONTEND_URL) {
  origins.push(process.env.FRONTEND_URL);
  origins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const cleanOrigin = origin.replace(/\/$/, '');
      const isAllowed = origins.some(allowed => allowed.replace(/\/$/, '') === cleanOrigin)
        || cleanOrigin.endsWith('.vercel.app');

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
)
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// Routes Setup
app.use('/api/auth', authRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/resume', resumeRoutes) // <-- Resume Route Prefix: /api/resume
app.use('/api/ai', aiRoutes)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})