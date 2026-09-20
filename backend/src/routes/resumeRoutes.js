import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { parseResume, checkAtsScore } from '../controllers/resumeController.js';
import { optionalAuth } from '../middleware/auth.js';
import { aiUserRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Uploads folder auto-create karein agar nahi bana hai taaki multer error na de
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

// Route: POST /api/resume/autofill (AI Powered Resume Parsing)
router.post('/autofill', optionalAuth, aiUserRateLimiter, upload.single('resume'), parseResume);

// Route: POST /api/resume/ats-check (AI Powered ATS Audit)
router.post('/ats-check', optionalAuth, aiUserRateLimiter, upload.single('resume'), checkAtsScore);

export default router;