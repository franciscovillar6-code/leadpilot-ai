import { createGoogle } from "@ai-sdk/google";

export function createGoogleAiProvider(apiKey: string) {
  return createGoogle({
    apiKey,
  });
}