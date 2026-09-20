import express from 'express'
import { 
    createPortfolio, 
    getAllUserPortfolios, 
    getSinglePortfolioById,
    updatePortfolio,
    deletePortfolio,
    getPublicPortfolio,
    togglePublicStatus,
    checkSlugAvailability,
    updateCustomSlug,
    verifyPublicPasscode,
    savePortfolioVersion,
    getPortfolioVersions,
    restorePortfolioVersion,
    generateOgImage
} from '../controllers/portfolioController.js'
import { requireAuth } from '../middleware/auth.js'

import multer from 'multer'
import path from 'path'

const router = express.Router()

// Configure multer storage to preserve extensions
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Public routes — NO auth required (must be before /:id to avoid conflict)
router.get('/public/:slug', getPublicPortfolio)
router.post('/public/:slug/verify-passcode', verifyPublicPasscode)
router.get('/check-slug/:slug', checkSlugAvailability)
router.get('/og/:identifier', generateOgImage)


// Authenticated routes
router.post('/create', requireAuth, createPortfolio)
router.get('/my-portfolios', requireAuth, getAllUserPortfolios)
router.put('/:id/custom-slug', requireAuth, updateCustomSlug)
router.put('/:id', requireAuth, updatePortfolio)
router.delete('/:id', requireAuth, deletePortfolio)
router.post('/:id/toggle-public', requireAuth, togglePublicStatus)

// Version history endpoints
router.post('/:id/versions', requireAuth, savePortfolioVersion)
router.get('/:id/versions', requireAuth, getPortfolioVersions)
router.post('/:id/versions/:versionId/restore', requireAuth, restorePortfolioVersion)

router.post('/upload-media', requireAuth, upload.single('media'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        return res.status(200).json({
            success: true,
            message: 'Media uploaded successfully.',
            url: fileUrl
        });
    } catch (error) {
        console.error('Media upload error:', error);
        return res.status(500).json({ success: false, message: 'Failed to upload media.' });
    }
});
router.get('/:id', requireAuth, getSinglePortfolioById)

export default router