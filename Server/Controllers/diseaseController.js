import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read prompts.json
const promptsPath = path.join(__dirname, '../prompts.json');
const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Convert image file to base64
 */
function imageToBase64(filepath) {
    const imageBuffer = fs.readFileSync(filepath);
    return imageBuffer.toString('base64');
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif'
    };
    return mimeTypes[ext] || 'image/jpeg';
}

/**
 * Handle soil/crop image upload
 */
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        
        res.status(200).json({
            message: 'Image uploaded successfully',
            filename: req.file.filename,
            imageUrl: imageUrl,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (err) {
        console.error('Image upload error:', err);
        res.status(500).json({ error: 'Image upload failed' });
    }
};

/**
 * Analyze image using Gemini AI
 * Supports soil and disease/pest analysis
 */
export const analyzeImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const { analyzeType, farmLocation, currentCrop } = req.body;
        
        if (!analyzeType) {
            return res.status(400).json({ error: 'analyzeType is required (soil or disease)' });
        }

        if (!['soil', 'disease'].includes(analyzeType)) {
            return res.status(400).json({ error: 'analyzeType must be either "soil" or "disease"' });
        }

        const filepath = req.file.path;
        const filename = req.file.filename;
        const mimeType = getMimeType(filename);

        // Convert image to base64
        const imageBase64 = imageToBase64(filepath);

        // Get appropriate prompt based on analysis type
        let userPrompt = '';

        if (analyzeType === 'soil') {
            userPrompt = `${promptsData.system_prompts.soil_analysis.title}
            
Analysis Points to Cover:
${promptsData.system_prompts.soil_analysis.analysis_points.map(p => `- ${p}`).join('\n')}

Please analyze this soil image and provide:
${promptsData.system_prompts.soil_analysis.recommendations_based_on.map(p => `- ${p}`).join('\n')}

Return the analysis in JSON format with the following structure:
{
  "soilType": "detected soil type",
  "color": "soil color observed",
  "texture": "soil texture",
  "ph_level": "estimated pH",
  "nitrogen_level": "estimated N status (Low/Medium/High)",
  "phosphorus_level": "estimated P status",
  "potassium_level": "estimated K status",
  "organic_matter": "assessment",
  "drainage_capacity": "assessment",
  "recommended_crops": ["crop1", "crop2"],
  "improvement_suggestions": ["suggestion1", "suggestion2"],
  "fertilizer_recommendations": [{"nutrient": "N", "kg_per_acre": 80}],
  "confidence_score": 0.0-1.0
}`;
        } else if (analyzeType === 'disease') {
            userPrompt = `${promptsData.system_prompts.disease_detection.title}
            
Detection Parameters to Check:
${promptsData.system_prompts.disease_detection.detection_parameters.map(p => `- ${p}`).join('\n')}

${currentCrop ? `Current Crop: ${currentCrop}` : ''}
${farmLocation ? `Farm Location: ${farmLocation}` : ''}

Please analyze this crop/leaf image and provide:
${promptsData.system_prompts.disease_detection.treatment_recommendations.map(p => `- ${p}`).join('\n')}

Return the analysis in JSON format with the following structure:
{
  "disease_detected": true/false,
  "disease_name": "name if detected",
  "pest_name": "pest name if pest detected",
  "severity": "mild/moderate/severe",
  "affected_area_percentage": 0-100,
  "symptoms_observed": ["symptom1", "symptom2"],
  "causative_factors": ["factor1", "factor2"],
  "immediate_actions": ["action1", "action2"],
  "organic_treatment": ["treatment1", "treatment2"],
  "chemical_treatment": [{"product": "name", "dosage": "quantity"}],
  "prevention_measures": ["measure1", "measure2"],
  "recovery_timeline_days": 14,
  "confidence_score": 0.0-1.0
}`;
        }

        // Call Gemini API using Vercel AI SDK with vision
        const result = await generateText({
            model: google('gemini-2.5-flash'),
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            image: Buffer.from(imageBase64, 'base64'),
                            mimeType: mimeType
                        },
                        {
                            type: 'text',
                            text: userPrompt
                        }
                    ]
                }
            ]
        });

        console.log('Gemini response:', result.text);

        const analysisText = result.text;
        
        // Extract JSON from response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        const analysisJson = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_response: analysisText };

        res.status(200).json({
            success: true,
            message: 'Image analysis completed successfully',
            filename: filename,
            analyzeType: analyzeType,
            analysis: analysisJson,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('Image analysis error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Image analysis failed',
            details: err.message 
        });
    }
};

/**
 * Get uploaded image by filename
 */
export const getImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const filepath = path.join('./uploads', filename);

        // Security check - prevent directory traversal
        if (!filepath.startsWith(path.resolve('./uploads'))) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.sendFile(filepath);
    } catch (err) {
        console.error('Get image error:', err);
        res.status(500).json({ error: 'Failed to retrieve image' });
    }
};

/**
 * Delete uploaded image
 */
export const deleteImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const filepath = path.join('./uploads', filename);

        // Security check
        if (!filepath.startsWith(path.resolve('./uploads'))) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'Image not found' });
        }

        fs.unlinkSync(filepath);
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (err) {
        console.error('Delete image error:', err);
        res.status(500).json({ error: 'Failed to delete image' });
    }
};
