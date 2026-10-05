import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { handleChatbot } from "../controllers/chatbotController.js";

const router = Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);      

export default router;
