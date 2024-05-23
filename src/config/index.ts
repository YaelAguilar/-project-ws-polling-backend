import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://defaultURL',
    SECRET: process.env.SECRET || 'defaultSecret'
};

export default config;
