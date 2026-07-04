import express from 'express';
import { polishText, matchJobDescription, tailorForm } from '../controllers/aiController.js';
import { chatWithPortfolioRAG } from '../chat/chatController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// AI Routes
router.post('/polish', requireAuth, polishText);
router.post('/match-job/:portfolioId', requireAuth, matchJobDescription);
router.post('/tailor-form', requireAuth, tailorForm);
router.post('/chat/:portfolioId', chatWithPortfolioRAG); // Public endpoint for portfolio chatbot widgets (RAG Enabled)

export default router;
