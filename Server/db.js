import mongoose from 'mongoose';

export async function connectDB() {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    try {
        await mongoose.connect(uri);
        console.log('✓ MongoDB connected successfully');
    } catch (err) {
        console.error('✗ MongoDB connection error:', err.message);
        process.exit(1);
    }
}

mongoose.connection.on('disconnected', () => {
    console.warn('⚠ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('✓ MongoDB reconnected');
});

export { mongoose };
