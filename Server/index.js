import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB, mongoose } from './db.js';
import authRoutes from './Routes/authRoutes.js';
import diseaseRoutes from './Routes/diseaseRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Database connection test route
app.get('/api/test/db', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    
    if (dbState === 1) {
        res.json({ 
            status: 'success',
            message: 'Database connected successfully',
            dbStatus: states[dbState],
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Database not connected',
            dbStatus: states[dbState],
            timestamp: new Date().toISOString()
        });
    }
});

// Middleware to serve static files (for uploaded images)
app.use('/uploads', express.static('uploads'));

// Auth routes
app.use('/api/auth', authRoutes);

// Disease/Image analysis routes
app.use('/api/analyze', diseaseRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;