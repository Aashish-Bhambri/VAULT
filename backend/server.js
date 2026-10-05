import "dotenv/config";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import auth from './routes/authRoute.js';
import chatbotRoute from "./routes/chatbotRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json()); // Essential for parsing req.body

app.get('/', (req, res) => {
    res.send({ message: 'Server running' });
});

app.use('/user', auth);
app.use("/api/chatbot", chatbotRoute);

const startServer = async () => {
    try {
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB connected successfully');
        } else {
            console.warn('Warning: MONGO_URI is not set in .env');
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
    }
};

startServer();


