import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, provider, fileContexts } = await req.json();
    console.log("Chat API Request - Provider:", provider);
    console.log("OLLAMA_URL env:", process.env.OLLAMA_URL);

    let apiKey = "";
    let baseURL = "";
    let model = "";

    if (provider === "Groq") {
      apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
      baseURL = "https://api.groq.com/openai/v1";
      model = "llama-3.3-70b-versatile";
    } else if (provider === "OpenRouter") {
      apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
      baseURL = "https://openrouter.ai/api/v1";
      model = "meta-llama/llama-3.3-70b-instruct";
    } else if (provider === "Ollama") {
      apiKey = "ollama";
      baseURL = process.env.OLLAMA_URL || "http://localhost:11434/v1";
      model = "llama3:latest";
    }

    if (!apiKey && provider !== "Ollama") {
      return new Response(
        JSON.stringify({ error: `${provider} API key not found` }),
        { status: 400 },
      );
    }

    const openai = createOpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
    });

    const finalMessages = [...messages];
    if (fileContexts) {
      finalMessages.unshift({
        role: "system",
        content: `You have access to the following documents. Use them to answer questions accurately:\n\n${fileContexts}`,
      });
    }

    const result = await streamText({
      model: openai(model),
      messages: finalMessages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
