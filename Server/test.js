import dotenv from 'dotenv';
dotenv.config();

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

async function testGemini() {
    try {
        console.log('Testing AI SDK with Gemini...');
        
        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: 'How does photosynthesis work?',
        });

        console.log('✓ Success!');
        console.log('Response:', result.text);
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
}

testGemini();




