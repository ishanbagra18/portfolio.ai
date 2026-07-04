import express from 'express'
import { signup, login, logout, getProfile, updateProfile, getPublicPortfolio } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/profile', requireAuth, getProfile)
router.put('/profile', requireAuth, updateProfile)

// Public endpoint to load portfolio by User ID
router.get('/portfolio/:userId', getPublicPortfolio)

export default router
