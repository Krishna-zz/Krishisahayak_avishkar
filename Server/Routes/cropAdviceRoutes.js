import express from 'express';
import multer from 'multer';
import path from 'path';
import { getCropAdvice, getWeather, analyzeSoilForLocation } from '../Controllers/cropAdviceController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'soil-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
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
 * Routes for crop advice
 */

/**
 * Get comprehensive crop advice with weather and soil analysis
 * POST /api/crop-advice/suggest
 * Body: { location: "string", soilImage?: file, additionalInfo?: "string" }
 * Returns: Crop recommendations, weather, soil analysis, farming tips
 */
router.post('/suggest', upload.single('soilImage'), getCropAdvice);

/**
 * Get weather data for a location
 * GET /api/crop-advice/weather?location=locationName
 */
router.get('/weather', getWeather);

/**
 * Analyze soil for a location (with or without image)
 * POST /api/crop-advice/analyze-soil-for-location
 * Body: { location: "string", soilImage?: file }
 */
router.post('/analyze-soil-for-location', upload.single('soilImage'), analyzeSoilForLocation);

export default router;
