import { Router } from "express";
import { handleChatbot } from "../controllers/chatbotController.js";
import { handleChatBot2 } from "../controllers/chatBot2Controller.js";

const router = Router();
router.all("/", handleChatBot2);
router.post("/message", handleChatbot);

export default router;
