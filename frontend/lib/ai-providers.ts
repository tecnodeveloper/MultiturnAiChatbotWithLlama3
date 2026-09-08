export interface AIModel {
  id: string;
  name: string;
}

export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "OpenRouter",
    name: "OpenRouter (Cloud)",
    models: [
      { id: "openrouter/free", name: "OpenRouter Free (Auto-best free model)" },
      { id: "google/gemma-4-26b-a4b-it:free", name: "Google Gemma 4 26B (Free)" },
      { id: "nvidia/nemotron-3.5-lightning:free", name: "Nvidia Nemotron 3.5 (Free)" },
      { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B (Requires Credits)" },
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (Requires Credits)" },
    ],
  },
  {
    id: "Groq",
    name: "Groq Cloud (Fast)",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile (Free)" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant (Free)" },
      { id: "llama3-70b-8192", name: "Llama 3 70B (High Intelligence)" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
    ],
  },
  {
    id: "Ollama",
    name: "Local Ollama (Requires local server)",
    models: [
      { id: "llama3:latest", name: "Llama 3 (Local)" },
      { id: "llama2", name: "Llama 2 (Local)" },
      { id: "mistral", name: "Mistral (Local)" },
    ],
  },
];
