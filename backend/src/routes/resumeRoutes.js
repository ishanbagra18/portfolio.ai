import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { parseResume, checkAtsScore } from '../controllers/resumeController.js';

const router = express.Router();

// Uploads folder auto-create karein agar nahi bana hai taaki multer error na de
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

// Route: POST /api/resume/autofill
router.post('/autofill', upload.single('resume'), parseResume);

// Route: POST /api/resume/ats-check
router.post('/ats-check', upload.single('resume'), checkAtsScore);

export default router;