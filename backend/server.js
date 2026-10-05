import "dotenv/config";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './routes/authRoute.js';
import chatbotRoute from "./routes/chatbotRoute.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json()); 



export const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    if (!process.env.MONGO_URI) {
        console.warn('Warning: MONGO_URI is not set in environment variables');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of hanging if Atlas IP is blocked
        });
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
    }
};

// Healthcheck endpoint (does not require DB)
app.get('/', (req, res) => {
    res.send({ 
        message: 'Server running',
        dbStatus: isConnected || mongoose.connection.readyState >= 1 ? 'connected' : 'disconnected'
    });
});

// Chatbot routes (uses Groq AI, does not require MongoDB)
app.use("/api/chatbot", chatbotRoute);

// Auth routes (requires MongoDB connection)
app.use('/user', async (req, res, next) => {
    await connectDB();
    next();
}, auth);

// Start server locally only (Vercel serverless invokes the exported app handler directly)
if (!process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

export default app;
