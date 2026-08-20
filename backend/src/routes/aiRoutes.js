import express from 'express';
import { polishText, matchJobDescription, tailorForm, matchPortfolioJob, generateCoverLetter, generateInterviewPrep, generateColdEmail, sendColdEmail, findHREmail } from '../controllers/aiController.js';
import { chatWithPortfolioRAG } from '../chat/chatController.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// AI Routes
router.post('/polish', requireAuth, polishText);
router.post('/match-job', requireAuth, upload.single('resume'), matchJobDescription);
router.post('/tailor-form', requireAuth, tailorForm);
router.post('/match-portfolio-job/:portfolioId', requireAuth, matchPortfolioJob);
router.post('/cover-letter', requireAuth, upload.single('resume'), generateCoverLetter);
router.post('/interview-prep', requireAuth, upload.single('resume'), generateInterviewPrep);
router.post('/generate-cold-email', requireAuth, generateColdEmail);
router.post('/send-cold-email', requireAuth, sendColdEmail);
router.post('/find-hr-email', requireAuth, findHREmail);
router.post('/chat/:portfolioId', chatWithPortfolioRAG); // Public endpoint for portfolio chatbot widgets (RAG Enabled)

export default router;
