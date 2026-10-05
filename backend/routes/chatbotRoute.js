import { Router } from "express";
import { handleChatbot } from "../controllers/chatbotController.js";

const router = Router();
router.post("/message", handleChatbot);

export default router;
