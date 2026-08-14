import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { defineAgent } from "eve";

const nexorouter = createOpenAICompatible({
  name: "nexorouter",
  baseURL: "https://api.nexorouter.com/v1",
  apiKey: process.env.NEXOROUTER_API_KEY,
});

const modelId = process.env.NEXOROUTER_MODEL ?? "kimi-k2.6";

export default defineAgent({
  model: nexorouter.chatModel(modelId),
  modelContextWindowTokens: 128_000,
});
