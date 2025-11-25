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

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {string} locationName - Location name or coordinates
 * @returns {Object} Weather data
 */
async function getWeatherData(locationName) {
    try {
        // Using OpenWeatherMap API - you need to add WEATHER_API_KEY to .env
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            console.warn('WEATHER_API_KEY not configured, returning mock data');
            return getMockWeatherData(locationName);
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            console.warn('Weather API error, returning mock data');
            return getMockWeatherData(locationName);
        }

        const data = await response.json();

        return {
            location: data.name,
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            description: data.weather[0].description,
            windSpeed: data.wind.speed,
            cloudiness: data.clouds.all,
            rainfall: data.rain?.['1h'] || 0,
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
        };
    } catch (error) {
        console.error('Weather fetch error:', error);
        return getMockWeatherData(locationName);
    }
}

/**
 * Get mock weather data when API is not available
 */
function getMockWeatherData(locationName) {
    return {
        location: locationName,
        temperature: 28,
        feelsLike: 30,
        humidity: 65,
        pressure: 1013,
        description: 'Partly cloudy',
        windSpeed: 5,
        cloudiness: 40,
        rainfall: 0,
        sunrise: '06:00:00',
        sunset: '18:00:00',
        mock: true
    };
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
 * Get soil data - either from uploaded image or from Gemini based on location
 */
async function getSoilData(soilImage, locationName) {
    let soilInfo = '';

    if (soilImage && soilImage.filepath) {
        // Analyze uploaded soil image
        try {
            const imageBase64 = imageToBase64(soilImage.filepath);
            const mimeType = getMimeType(soilImage.filename);

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
                                text: `Analyze this soil image and provide brief soil type, color, texture, and estimated fertility level. Return as JSON: {soilType, color, texture, fertility: "Low/Medium/High"}`
                            }
                        ]
                    }
                ]
            });

            soilInfo = result.text;
        } catch (error) {
            console.error('Soil image analysis error:', error);
            soilInfo = 'Could not analyze soil image';
        }
    } else {
        // Generate soil data based on location using Gemini
        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: `Based on the location "${locationName}", provide typical soil characteristics found in this region. Include: soilType, typical fertility level, pH range, drainage, organic matter content. Return as JSON format.`
        });

        soilInfo = result.text;
    }

    return soilInfo;
}

/**
 * Get crop recommendations and advice
 * POST /api/crop-advice/suggest
 * Body: { location: string, soilImage?: file, additionalInfo?: string }
 */
export const getCropAdvice = async (req, res) => {
    try {
        const { location, additionalInfo } = req.body;

        if (!location) {
            return res.status(400).json({ error: 'Location is required' });
        }

        // Fetch weather data for the location
        console.log(`Fetching weather for ${location}...`);
        const weatherData = await getWeatherData(location);

        // Get soil data
        console.log('Analyzing soil data...');
        const soilData = await getSoilData(req.file, location);

        // Generate comprehensive crop advice using Gemini
        console.log('Generating crop advice...');

        const advicePrompt = `You are an agricultural advisor. Based on the following information, provide comprehensive crop advice:

Location: ${location}
Weather Data:
- Temperature: ${weatherData.temperature}°C (Feels like: ${weatherData.feelsLike}°C)
- Humidity: ${weatherData.humidity}%
- Rainfall: ${weatherData.rainfall}mm
- Wind Speed: ${weatherData.windSpeed} m/s
- Sunrise: ${weatherData.sunrise}, Sunset: ${weatherData.sunset}
- Description: ${weatherData.description}

Soil Information:
${soilData}

${additionalInfo ? `Additional Information: ${additionalInfo}` : ''}

Please provide a detailed JSON response with:
{
  "bestCrops": ["crop1", "crop2", "crop3"],
  "cropDetails": [
    {
      "cropName": "name",
      "suitability": "High/Medium/Low",
      "season": "Kharif/Rabi/Summer",
      "waterRequirement": "mm/season",
      "temperatureRange": "min-max°C",
      "soilPreference": "description",
      "estimatedYield": "kg/hectare",
      "key_considerations": ["point1", "point2"]
    }
  ],
  "farmingTips": ["tip1", "tip2", "tip3"],
  "weatherAdvice": "specific advice based on current weather",
  "soilManagement": "recommendations for soil improvement",
  "pestPrevention": "common pests and prevention methods",
  "irrigationSchedule": "recommended schedule",
  "fertiliserRecommendation": "NPK ratio and timing",
  "riskFactors": ["risk1", "risk2"],
  "profitabilityIndex": "assessment based on weather and soil"
}`;

        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: advicePrompt
        });

        console.log('Crop advice generated');

        // Extract JSON from response
        const jsonMatch = result.text.match(/\{[\s\S]*\}/);
        const adviceJson = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_response: result.text };

        res.status(200).json({
            success: true,
            message: 'Crop advice generated successfully',
            data: {
                location: location,
                weather: weatherData,
                soilAnalysis: soilData,
                cropAdvice: adviceJson,
                generatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Crop advice error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate crop advice',
            details: error.message
        });
    }
};

/**
 * Get weather only
 * GET /api/crop-advice/weather?location=locationName
 */
export const getWeather = async (req, res) => {
    try {
        const { location } = req.query;

        if (!location) {
            return res.status(400).json({ error: 'Location query parameter is required' });
        }

        const weatherData = await getWeatherData(location);

        res.status(200).json({
            success: true,
            data: weatherData
        });

    } catch (error) {
        console.error('Weather error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch weather',
            details: error.message
        });
    }
};

/**
 * Get soil analysis only
 * POST /api/crop-advice/analyze-soil-for-location
 * Body: { location: string, soilImage?: file }
 */
export const analyzeSoilForLocation = async (req, res) => {
    try {
        const { location } = req.body;

        if (!location) {
            return res.status(400).json({ error: 'Location is required' });
        }

        const soilData = await getSoilData(req.file, location);

        res.status(200).json({
            success: true,
            location: location,
            soilAnalysis: soilData,
            hasImage: !!req.file,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Soil analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze soil',
            details: error.message
        });
    }
};
