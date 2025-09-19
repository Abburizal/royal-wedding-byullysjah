const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use environment variable or default to local MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-wedding-ully';
        
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        
        console.log('✅ MongoDB connected successfully');
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔄 MongoDB connection closed');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        
        // For development: continue without MongoDB if connection fails
        if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️ Running without database in development mode');
            return false;
        }
        
        process.exit(1);
    }
    
    return true;
};

module.exports = connectDB;