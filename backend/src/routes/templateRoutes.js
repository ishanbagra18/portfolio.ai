import express from 'express';
import { getTemplateLikes, likeTemplate } from '../controllers/templateController.js';

const router = express.Router();

// GET all template likes
router.get('/likes', getTemplateLikes);

// POST increment like for a specific template
router.post('/like/:templateId', likeTemplate);

export default router;
