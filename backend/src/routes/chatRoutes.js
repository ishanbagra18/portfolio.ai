import express from 'express';
import { chatWithPortfolioRAG } from '../chat/chatController.js';

const router = express.Router();

// Public endpoint for live portfolio chatbot widgets (RAG enabled)
router.post('/chat/:portfolioId', chatWithPortfolioRAG);

export default router;
