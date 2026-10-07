import { generateStreamResponse } from "../ai/groq.js";

export const handleChatBot2 = async (req, res) => {
    try {
        const { message } = req.body;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ error: "Message is required" });
        }

        // 1. Tell browser this is an ongoing Event Stream (SSE)
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // 2. Obtain stream from Groq
        const stream = await generateStreamResponse(message);

        // 3. Send tokens as they arrive
        for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content || "";
            if (token) {
                res.write(`data: ${JSON.stringify({ token })}\n\n`);
            }
        }

        // 4. Signal stream completion
        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        console.error("Streaming error in chatBot2Controller:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Streaming failed" });
        } else {
            res.end();
        }
    }
};

export default handleChatBot2;
