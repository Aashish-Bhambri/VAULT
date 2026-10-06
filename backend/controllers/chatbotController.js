import Groq from "groq-sdk";
import { TypeSafeClient, choice, noul } from "@typesafe-ai/sdk";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize TypeSafeClient routed through Vercel AI Gateway
const typeSafe = new TypeSafeClient({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.TYPESAFE_API_KEY,
  baseURL: "https://ai-gateway.vercel.sh/typesafe",
});

export const handleChatbot = async (req, res) => {
  try {
    // 1. Get the message sent from the frontend
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // -------------------------------------------------------------------------
    // 2. Jev via Vercel AI Gateway: Fast Decision Engine (System One)
    // -------------------------------------------------------------------------
    let jevMetadata = {
      isGaming: true,
      intent: "general_chat",
      genre: "None",
      confidence: 1,
    };

    try {
      if (process.env.AI_GATEWAY_API_KEY || process.env.TYPESAFE_API_KEY) {
        const jevResult = await typeSafe.systemOne({
          state: { document: message },
          questions: {
            isGaming: noul("Is this message or inquiry related to video games, consoles, or gaming?"),
            intent: choice("What is the primary intent of the user?", {
              recommendation: "Asking for game recommendations or suggestions",
              platform_info: "Asking about console or PC specifications or platforms",
              release_date: "Asking about release dates or announcements",
              general_chat: "Casual greeting, conversation, or general gaming inquiry",
            }),
            genre: choice("Which video game genre is requested or mentioned?", {
              RPG: "Role playing games",
              Action: "Action / Adventure",
              Shooter: "FPS or Third-person shooter",
              Coop: "Co-op / Multiplayer games",
              Indie: "Indie games",
              Strategy: "Strategy or RTS games",
              None: "No specific genre mentioned",
            }),
          },
        });

        const isGamingProb = jevResult?.answers?.isGaming?.noul ?? 1;
        const isGaming = isGamingProb >= 0.35;
        const detectedIntent = jevResult?.answers?.intent?.choice || "general_chat";
        const detectedGenre = jevResult?.answers?.genre?.choice || "None";

        jevMetadata = {
          isGaming,
          intent: detectedIntent,
          genre: detectedGenre,
          confidence: jevResult?.answers?.intent?.confidence,
        };

        // Guardrail: Fast reject queries completely unrelated to gaming
        if (!isGaming) {
          return res.status(200).json({
            reply: "I am your RAWG Game Assistant! Please ask questions about games, genres, platforms, or recommendations.",
            meta: jevMetadata,
          });
        }
      }
    } catch (gatewayError) {
      // Graceful fallback: If Vercel Gateway requires verification or is unreachable, continue with Groq
      console.warn("Jev Vercel AI Gateway note:", gatewayError.message);
    }

    // -------------------------------------------------------------------------
    // 3. Groq: Generative Response (System Two) informed by Jev's metadata
    // -------------------------------------------------------------------------
    const systemPrompt = `You are the official RAWG Video Game Assistant, dedicated EXCLUSIVELY to video games, gaming platforms, game recommendations, and gaming lore.
STRICT DOMAIN BOUNDARY:
- You must ONLY discuss video games, game genres, gaming platforms (PC, PlayStation, Xbox, Switch, etc.), release dates, and game recommendations.
- If the user asks about ANYTHING outside of video games (such as JavaScript, programming/coding, homework, general science, math, recipes, non-gaming topics), you MUST politely refuse.
- When refusing off-topic queries, reply: "I am your RAWG Game Assistant, so I can only help with video games and game recommendations! Feel free to ask about your favorite games, genres, or platforms."
- Do NOT generate markdown tables; format recommendations with clean, concise bullet points and bold titles.
${jevMetadata.intent !== "general_chat" ? `Context from Jev: Intent is "${jevMetadata.intent}", Preferred Genre is "${jevMetadata.genre !== "None" ? jevMetadata.genre : "Any"}".` : ""}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "openai/gpt-oss-120b",
    });

    // 4. Extract reply text
    const botReply = completion.choices[0]?.message?.content || "No response received";

    // 5. Send back to frontend with decision metadata
    return res.status(200).json({
      reply: botReply,
      meta: jevMetadata,
    });
  } catch (error) {
    console.error("Chatbot Error:", error);
    return res.status(500).json({ error: "Failed to generate chatbot response" });
  }
};
