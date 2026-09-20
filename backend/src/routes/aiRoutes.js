import express from 'express';
import { 
  polishText, 
  matchJobDescription, 
  tailorForm, 
  matchPortfolioJob, 
  generateCoverLetter, 
  generateInterviewPrep
} from '../controllers/aiController.js';
import { chatWithPortfolioRAG } from '../chat/chatController.js';
import { requireAuth } from '../middleware/auth.js';
import { aiUserRateLimiter, publicChatRateLimiter } from '../middleware/rateLimiter.js';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// AI Routes (Authenticated + Per-User Rate Limited)
router.post('/polish', requireAuth, aiUserRateLimiter, polishText);
router.post('/match-job', requireAuth, aiUserRateLimiter, upload.single('resume'), matchJobDescription);
router.post('/tailor-form', requireAuth, aiUserRateLimiter, tailorForm);
router.post('/match-portfolio-job/:portfolioId', requireAuth, aiUserRateLimiter, matchPortfolioJob);
router.post('/cover-letter', requireAuth, aiUserRateLimiter, upload.single('resume'), generateCoverLetter);
import { chatAssistant } from '../controllers/assistantController.js';

// AI Assistant / Copilot (Authenticated + Per-User Rate Limited)
router.post('/assistant', requireAuth, aiUserRateLimiter, chatAssistant);

// Public endpoint for portfolio chatbot widgets (RAG Enabled + Public Rate Limited)
router.post('/chat/:portfolioId', publicChatRateLimiter, chatWithPortfolioRAG);

export default router;
