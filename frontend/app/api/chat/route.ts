import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, provider, fileContexts } = await req.json();

    let apiKey = "";
    let baseURL = "";
    let model = "";

    if (provider === "Groq") {
      apiKey = process.env.GROQ_API_KEY || "";
      baseURL = "https://api.groq.com/openai/v1";
      model = "llama-3.3-70b-versatile";
    } else if (provider === "OpenRouter") {
      apiKey = process.env.OPENROUTER_API_KEY || "";
      baseURL = "https://openrouter.ai/api/v1";
      model = "meta-llama/llama-3.3-70b-instruct";
    } else if (provider === "Ollama") {
      apiKey = "ollama"; // Usually not required for local
      baseURL = process.env.OLLAMA_URL || "http://localhost:11434/v1";
      model = "llama3";
    }

    if (!apiKey && provider !== "Ollama") {
      return new Response(
        JSON.stringify({ error: `${provider} API key not found` }),
        { status: 400 },
      );
    }

    const client = new OpenAI({
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

    const response = await client.chat.completions.create({
      model: model,
      messages: finalMessages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
