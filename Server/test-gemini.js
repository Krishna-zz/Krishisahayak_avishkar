import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testTextGeneration() {
    try {
        console.log('Testing Gemini API with text generation...');
        
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const response = await model.generateContent('How does photosynthesis work?');
        const text = response.response.text();
        
        console.log('✓ Response:', text);
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
}

testTextGeneration();
