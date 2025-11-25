import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeImageFromFile(imagePath) {
    try {
        console.log('Analyzing image:', imagePath);
        
        // Read image file
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        // Determine MIME type
        const ext = path.extname(imagePath).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.gif': 'image/gif'
        };
        const mimeType = mimeTypes[ext] || 'image/jpeg';
        
        // Get model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        // Send image for analysis
        const response = await model.generateContent([
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                },
            },
            'Describe this image in detail.',
        ]);
        
        const text = response.response.text();
        console.log('✓ Analysis Result:\n', text);
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
}

// Usage example
const testImagePath = './uploads/test-image.jpg'; // Update this path
if (fs.existsSync(testImagePath)) {
    analyzeImageFromFile(testImagePath);
} else {
    console.log('Test image not found at:', testImagePath);
    console.log('Please provide a valid image path.');
}
