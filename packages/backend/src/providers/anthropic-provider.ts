import Anthropic from '@anthropic-ai/sdk'
import {
  AIProvider,
  ChatMessage,
  Tool,
  ToolResult,
  AIResponse,
} from '../types/ai-provider.js'

const SYSTEM_PROMPT = `You are ChatFlow, an AI assistant that helps users automate tasks across multiple services.

You are friendly, helpful, and concise. You help users with:
- Creating and managing Supabase projects
- Managing credentials and API keys
- Automating common workflows

For now, you're in a basic mode without tool access. Just have natural conversations and help users understand what you can do.

When users ask about capabilities, explain that you'll soon be able to:
- Create Supabase projects
- Manage API keys securely
- Query databases
- And more integrations coming soon!`

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic'
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  validateConfig(): void {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        'ANTHROPIC_API_KEY is required. Get your key at https://console.anthropic.com/'
      )
    }
  }

  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = [],
    tools?: Tool[]
  ): Promise<AIResponse> {
    try {
      const messages: Anthropic.MessageParam[] = [
        ...conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ]

      const requestParams: Anthropic.MessageCreateParams = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages,
      }

      // Add tools if provided
      if (tools && tools.length > 0) {
        requestParams.tools = tools as any[]
      }

      const response = await this.client.messages.create(requestParams)

      // Extract text content
      const textContent = response.content
        .filter((block) => block.type === 'text')
        .map((block) => (block as Anthropic.TextBlock).text)
        .join('\n')

      // Extract tool uses if any
      const toolUses = response.content
        .filter((block) => block.type === 'tool_use')
        .map((block) => {
          const toolBlock = block as Anthropic.ToolUseBlock
          return {
            id: toolBlock.id,
            name: toolBlock.name,
            input: toolBlock.input as Record<string, any>,
          }
        })

      return {
        content: textContent,
        tool_uses: toolUses.length > 0 ? toolUses : undefined,
        stop_reason: response.stop_reason || undefined,
      }
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw new Error(`Failed to get response from Anthropic: ${error}`)
    }
  }

  async continueWithToolResult(
    conversationHistory: ChatMessage[],
    toolResults: ToolResult[],
    tools?: Tool[]
  ): Promise<AIResponse> {
    try {
      // Build messages with tool results
      const messages: Anthropic.MessageParam[] = conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))

      // Add tool results as a user message
      messages.push({
        role: 'user',
        content: toolResults.map((result) => ({
          type: 'tool_result' as const,
          tool_use_id: result.tool_use_id,
          content: result.content,
        })),
      })

      const requestParams: Anthropic.MessageCreateParams = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages,
      }

      if (tools && tools.length > 0) {
        requestParams.tools = tools as any[]
      }

      const response = await this.client.messages.create(requestParams)

      const textContent = response.content
        .filter((block) => block.type === 'text')
        .map((block) => (block as Anthropic.TextBlock).text)
        .join('\n')

      return {
        content: textContent,
        stop_reason: response.stop_reason || undefined,
      }
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw new Error(`Failed to continue with tool result: ${error}`)
    }
  }
}
