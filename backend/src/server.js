import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js' // <-- Naya Import Added
import aiRoutes from './routes/aiRoutes.js'

const app = express()
const port = process.env.PORT || 5000

// CORS Configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
)
app.use(express.json())

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