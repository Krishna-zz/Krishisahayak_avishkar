import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage, analyzeImage, getImage, deleteImage } from '../Controllers/diseaseController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Routes for disease/pest and soil analysis using Gemini AI Vision
 */

// Upload image only (without analysis)
router.post('/upload', upload.single('image'), uploadImage);

/**
 * Analyze Soil Image using Gemini Vision AIg
 * POST /api/disease/analyze-soil
 * Body: { image: <file>, farmLocation?: "string" }
 * Returns: Soil analysis with NPK levels, soil type, recommendations in JSON
 */
router.post('/analyze-soil', upload.single('image'), async (req, res) => {
    if (!req.body) req.body = {};
    req.body.analyzeType = 'soil';
    return analyzeImage(req, res);
});

/**
 * Analyze Disease/Pest on Crop using Gemini Vision AI
 * POST /api/disease/analyze-disease
 * Body: { image: <file>, currentCrop?: "string", farmLocation?: "string" }
 * Returns: Disease/pest detection, severity, treatment options in JSON
 */
router.post('/analyze-disease', upload.single('image'), async (req, res) => {
    if (!req.body) req.body = {};
    req.body.analyzeType = 'disease';
    return analyzeImage(req, res);
});

// Get image by filename
router.get('/image/:filename', getImage);

// Delete image
router.delete('/image/:filename', deleteImage);

export default router;