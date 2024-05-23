import mongoose from 'mongoose';
import config from './index';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
