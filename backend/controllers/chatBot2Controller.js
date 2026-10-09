import mongoose from "mongoose";
import Conversation from "../model/ChatBot.js";
import { generateStreamResponse } from "../ai/groq.js";
import { decide } from "../ai/jev.js";

// Helper function to stream Groq response to SSE client and collect full response
async function streamResponse(stream, res, onComplete) {
    let fullBotText = "";

    for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        if (token) {
            fullBotText += token;
            res.write(`data: ${JSON.stringify({ token })}\n\n`);
        }
    }

    if (onComplete) {
        try {
            await onComplete(fullBotText);
        } catch (dbErr) {
            console.error("Failed to save bot response to DB:", dbErr);
        }
    }

    res.write("data: [DONE]\n\n");
    res.end();
}

// -------------------------------------------------------------
// 1. GET ALL RECENT CONVERSATIONS (For Left Sidebar)
// -------------------------------------------------------------
export const getConversations = async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = userId ? { userId } : {};

        // Only select _id, title, and updatedAt for lightweight sidebar loading
        const conversations = await Conversation.find(filter)
            .select("_id title updatedAt createdAt")
            .sort({ updatedAt: -1 })
            .limit(30);

        return res.status(200).json({ conversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({ error: "Failed to fetch conversations" });
    }
};

// -------------------------------------------------------------
// 2. GET SINGLE CONVERSATION BY ID (When user clicks a recent chat)
// -------------------------------------------------------------
export const getConversationById = async (req, res) => {
    try {
        const { id } = req.params;
        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        return res.status(200).json(conversation);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        return res.status(500).json({ error: "Failed to fetch conversation" });
    }
};

// -------------------------------------------------------------
// 3. DELETE CONVERSATION (Delete button in sidebar)
// -------------------------------------------------------------
export const deleteConversation = async (req, res) => {
    try {
        const { id } = req.params;
        await Conversation.findByIdAndDelete(id);
        return res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        return res.status(500).json({ error: "Failed to delete conversation" });
    }
};

// -------------------------------------------------------------
// 4. MAIN CHAT STREAM HANDLER (Creates/Updates Conversation + Streams)
// -------------------------------------------------------------
export const handleChatBot2 = async (req, res) => {
    try {
        const { message, context, conversationId, userId } = req.body;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ error: "Message is required" });
        }

        // 1. Find existing conversation or create a new one
        let conversation = null;
        if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
            conversation = await Conversation.findById(conversationId);
        }

        if (!conversation) {
            // Auto-generate title from the first message (max 32 characters)
            const title = message.trim().length > 32 
                ? message.trim().slice(0, 32) + "..." 
                : message.trim();

            conversation = new Conversation({
                title,
                userId: userId || null,
                messages: []
            });
        }

        // 2. Append User message to conversation
        conversation.messages.push({
            sender: "user",
            text: message.trim()
        });
        await conversation.save();

        // 3. Setup SSE headers for streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // Send conversationId first so frontend knows active chatId immediately
        res.write(`data: ${JSON.stringify({ conversationId: conversation._id, title: conversation.title })}\n\n`);

        // Callback to save bot reply once streaming completes
        const saveBotResponse = async (botText) => {
            if (botText) {
                conversation.messages.push({
                    sender: "bot",
                    text: botText
                });
                await conversation.save();
            }
        };

        // 4. Jev decides what VAULT should do
        const decision = await decide(message, context);
        console.log("🧠 Jev Decision:", decision);

        // 5. Route based on Jev's decision
        switch (decision.route) {
            case "chat": {
                const stream = await generateStreamResponse(message);
                return await streamResponse(stream, res, saveBotResponse);
            }

            case "tool": {
                console.log(`[Tool pending]: Jev requested tools:`, decision.tools, decision.toolArgs);
                const prompt = `[Note: External tools (${decision.tools.join(", ")}) are still under development. Answer using your best knowledge]\n\nUser Question: ${message}`;
                const stream = await generateStreamResponse(prompt);
                return await streamResponse(stream, res, saveBotResponse);
            }

            case "rag": {
                console.log(`[RAG pending]: Jev requested query:`, decision.ragQuery);
                const prompt = `[Note: Knowledge base retrieval is still under development. Answer using your best knowledge]\n\nUser Question: ${message}`;
                const stream = await generateStreamResponse(prompt);
                return await streamResponse(stream, res, saveBotResponse);
            }

            default: {
                const stream = await generateStreamResponse(message);
                return await streamResponse(stream, res, saveBotResponse);
            }
        }
    } catch (error) {
        console.error("Streaming error in chatBot2Controller:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Streaming failed" });
        } else {
            res.write(`data: ${JSON.stringify({ error: "Something went wrong" })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
        }
    }
};

export default handleChatBot2;
