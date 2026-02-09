import { AIProvider, AIProviderType } from '../types/ai-provider.js'
import { AnthropicProvider } from './anthropic-provider.js'
import { OpenAIProvider } from './openai-provider.js'
import { GeminiProvider } from './gemini-provider.js'

/**
 * Factory function to create an AI provider based on environment configuration
 *
 * @param providerType - The type of provider to create (defaults to env var AI_PROVIDER)
 * @returns An instance of the specified AI provider
 * @throws Error if provider type is invalid or not configured
 */
export function createAIProvider(
  providerType?: string
): AIProvider {
  const provider = (
    providerType ||
    process.env.AI_PROVIDER ||
    AIProviderType.ANTHROPIC
  ).toLowerCase()

  let aiProvider: AIProvider

  switch (provider) {
    case AIProviderType.ANTHROPIC:
      aiProvider = new AnthropicProvider()
      break

    case AIProviderType.OPENAI:
      aiProvider = new OpenAIProvider()
      break

    case AIProviderType.GEMINI:
      aiProvider = new GeminiProvider()
      break

    default:
      throw new Error(
        `Unknown AI provider: ${provider}. Supported providers: ${Object.values(AIProviderType).join(', ')}`
      )
  }

  if (!aiProvider) {
    throw new Error('Failed to create AI provider')
  }

  // Validate configuration
  try {
    aiProvider.validateConfig()
  } catch (error: any) {
    throw new Error(
      `AI provider "${aiProvider.name}" configuration error: ${error.message}`
    )
  }

  console.log(`✅ AI Provider: ${aiProvider.name}`)
  return aiProvider
}

/**
 * Get list of supported AI providers
 */
export function getSupportedProviders(): string[] {
  return Object.values(AIProviderType)
}

export * from '../types/ai-provider.js'
export { AnthropicProvider } from './anthropic-provider.js'
export { OpenAIProvider } from './openai-provider.js'
export { GeminiProvider } from './gemini-provider.js'
