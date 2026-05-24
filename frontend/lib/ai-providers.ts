// AI Provider configurations
// This file will contain provider configs for OpenAI, Anthropic, Llama, etc.
// To be implemented in Phase 2+

export interface AIProviderConfig {
  name: string
  apiKey: string
  baseUrl?: string
  model: string
}

// Placeholder for future implementation
export const aiProviders = {
  // openai: { ... },
  // anthropic: { ... },
  // llama: { ... },
}
