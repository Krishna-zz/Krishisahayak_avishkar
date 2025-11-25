import mongoose from 'mongoose';

/**
 * /home/devkrsna/Projects/Krishisahayak_avishkar/Server/db.js
 *
 * Basic Mongoose setup. Set either:
 * - MONGODB_URI (full connection string) OR
 * - DB_PASSWORD (used with the provided user/host)
 *
 * Example env:
 *   export DB_PASSWORD="yourPassword"
 *   OR
 *   export MONGODB_URI="mongodb+srv://user:pass@cluster0.../dbname?retryWrites=true&w=majority"
 */

const DEFAULT_URI_BASE = 'mongodb+srv://krishnagavali973_db_user:<db_password>@cluster0.htq0izt.mongodb.net';
const uri =
    process.env.MONGODB_URI ||
    (() => {
        const pwd = process.env.DB_PASSWORD || '<db_password>';
        return `mongodb+srv://krishnagavali973_db_user:${encodeURIComponent(pwd)}@cluster0.htq0izt.mongodb.net/?retryWrites=true&w=majority`;
    })();

console.log('Connecting to MongoDB with URI:', uri.replace(/:[^@]+@/, ':***@'));

export async function connectDB() {
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

export const uriUsed = process.env.MONGODB_URI || DEFAULT_URI_BASE.replace('<db_password>', process.env.DB_PASSWORD ? '***' : '<db_password>');

export { mongoose };
