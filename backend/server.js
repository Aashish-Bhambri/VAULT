import "dotenv/config";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './routes/authRoute.js';
import chatbotRoute from "./routes/chatbotRoute.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json()); // Essential for parsing req.body

// Cache DB connection across serverless function invocations
let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    if (!process.env.MONGO_URI) {
        console.warn('Warning: MONGO_URI is not set in environment variables');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
    }
};

// Ensure DB is connected before handling any route
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.get('/', (req, res) => {
    res.send({ message: 'Server running' });
});

app.use('/user', auth);
app.use("/api/chatbot", chatbotRoute);

// Start server locally only (Vercel serverless invokes the exported app handler directly)
if (!process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

export default app;
