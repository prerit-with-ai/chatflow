/**
 * AI Provider Interface
 *
 * This interface defines the contract that all AI providers must implement.
 * It allows ChatFlow to work with any LLM provider (Anthropic, OpenAI, Google, etc.)
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface Tool {
  name: string
  description: string
  input_schema: Record<string, any>
}

export interface ToolUse {
  id: string
  name: string
  input: Record<string, any>
}

export interface ToolResult {
  tool_use_id: string
  content: string
}

export interface AIResponse {
  content: string
  tool_uses?: ToolUse[]
  stop_reason?: string
}

/**
 * AIProvider interface
 *
 * All AI providers (Anthropic, OpenAI, Google, etc.) must implement this interface.
 */
export interface AIProvider {
  /**
   * Provider name (e.g., "anthropic", "openai", "gemini")
   */
  readonly name: string

  /**
   * Send a chat message and get a response
   *
   * @param message - The user's message
   * @param conversationHistory - Previous messages in the conversation
   * @param tools - Optional array of tools the AI can use
   * @returns AI response with content and optional tool uses
   */
  sendMessage(
    message: string,
    conversationHistory?: ChatMessage[],
    tools?: Tool[]
  ): Promise<AIResponse>

  /**
   * Continue conversation after tool execution
   *
   * @param conversationHistory - Full conversation including tool uses and results
   * @param tools - Available tools
   * @returns Final AI response after processing tool results
   */
  continueWithToolResult(
    conversationHistory: ChatMessage[],
    toolResults: ToolResult[],
    tools?: Tool[]
  ): Promise<AIResponse>

  /**
   * Validate that the provider is properly configured
   *
   * @throws Error if configuration is invalid
   */
  validateConfig(): void
}

/**
 * Supported AI providers
 */
export enum AIProviderType {
  ANTHROPIC = 'anthropic',
  OPENAI = 'openai',
  GEMINI = 'gemini',
}
