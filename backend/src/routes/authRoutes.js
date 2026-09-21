import express from 'express'
import { signup, login, verifyOTP, logout, getProfile, updateProfile, getPublicPortfolio, oauthSession, forgotPassword, resetPassword } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { otpEmailRateLimiter, otpVerifyRateLimiter, authGeneralRateLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/signup', authGeneralRateLimiter, otpEmailRateLimiter, signup)
router.post('/login', authGeneralRateLimiter, otpEmailRateLimiter, login)
router.post('/login/verify', otpVerifyRateLimiter, verifyOTP)
router.post('/forgot-password', authGeneralRateLimiter, otpEmailRateLimiter, forgotPassword)
router.post('/reset-password', otpVerifyRateLimiter, resetPassword)
router.post('/oauth/session', authGeneralRateLimiter, oauthSession)
router.post('/logout', logout)
router.get('/profile', requireAuth, getProfile)
router.put('/profile', requireAuth, updateProfile)

// Public endpoint to load portfolio by User ID
router.get('/portfolio/:userId', getPublicPortfolio)

export default router

