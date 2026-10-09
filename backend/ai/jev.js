import { generateText, Output } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import { AI_CONFIG } from "../config/ai.js";

const decisionSchema = z.object({
    route: z.enum(["chat", "tool", "rag"]).describe("The execution path VAULT must take"),
    tools: z.array(
        z.enum([
            "rawg_search",
            "game_details",
            "steam_library",
            "steam_recent",
            "web_search"
        ])
    ).describe("List of tools to run (empty array if no tools needed)"),
    toolArgs: z.object({
        query: z.string().nullable().describe("Search query for rawg_search or web_search (null if not needed)"),
        game: z.string().nullable().describe("Game title or identifier for game_details (null if not needed)")
    }).nullable().describe("Arguments for the tools (null if route is not 'tool')"),
    ragQuery: z.string().nullable().describe("Query to search internal knowledge base (null if route is not 'rag')"),
    needsMemory: z.boolean(),
    reasoning: z.string().describe("Why this route was selected")
});

export async function decide(message, context = {}) {
    const { output } = await generateText({
        model: groq(AI_CONFIG.decisionModel || "llama-3.3-70b-versatile"),
        output: Output.object({ schema: decisionSchema }),
        system: `You are Jev, the decision engine for VAULT AI.
Do NOT answer the user. Determine the execution route:
- 'chat' for regular conversation
- 'tool' when external APIs (RAWG, Steam, Web) are needed
- 'rag' when knowledge base/documentation retrieval is needed`,
        prompt: `User message: ${message}\nContext: ${JSON.stringify(context)}`
    });

    return output;
}
