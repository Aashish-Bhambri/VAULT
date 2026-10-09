import { Router } from "express";
import { 
    handleChatBot2, 
    getConversations, 
    getConversationById, 
    deleteConversation 
} from "../controllers/chatBot2Controller.js";
import { handleChatbot } from "../controllers/chatbotController.js";

const router = Router();

// Streaming chat
router.post("/", handleChatBot2);
router.post("/message", handleChatbot);

// Conversation management
router.get("/conversations", getConversations);
router.get("/conversations/:id", getConversationById);
router.delete("/conversations/:id", deleteConversation);

export default router;
