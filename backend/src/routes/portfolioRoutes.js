import express from 'express'
import { 
    createPortfolio, 
    getAllUserPortfolios, 
    getSinglePortfolioById,
    updatePortfolio,
    deletePortfolio
} from '../controllers/portfolioController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/create', requireAuth, createPortfolio)
router.get('/my-portfolios', requireAuth, getAllUserPortfolios)
router.put('/:id', requireAuth, updatePortfolio)
router.delete('/:id', requireAuth, deletePortfolio)
router.get('/:id', requireAuth, getSinglePortfolioById)

export default router