import express from 'express';
import { chatWithPortfolioRAG } from '../chat/chatController.js';
import { publicChatRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public endpoint for live portfolio chatbot widgets (RAG enabled + Rate Limited)
router.post('/chat/:portfolioId', publicChatRateLimiter, chatWithPortfolioRAG);

export default router;
