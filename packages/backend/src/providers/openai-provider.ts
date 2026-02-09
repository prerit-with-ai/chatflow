import OpenAI from 'openai'
import {
  AIProvider,
  ChatMessage,
  Tool,
  ToolUse,
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

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai'
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  validateConfig(): void {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        'OPENAI_API_KEY is required. Get your key at https://platform.openai.com/'
      )
    }
  }

  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = [],
    tools?: Tool[]
  ): Promise<AIResponse> {
    try {
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: message,
        },
      ]

      const requestParams: OpenAI.ChatCompletionCreateParams = {
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages,
        max_tokens: 4096,
      }

      // Add tools if provided (convert MCP format to OpenAI function format)
      if (tools && tools.length > 0) {
        requestParams.tools = tools.map((tool) => ({
          type: 'function' as const,
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
          },
        }))
      }

      const response = await this.client.chat.completions.create(requestParams)

      const firstChoice = response.choices[0]
      const messageContent = firstChoice.message.content || ''

      // Extract tool calls if any
      const toolCalls = firstChoice.message.tool_calls || []
      const toolUses: ToolUse[] = toolCalls.map((toolCall) => {
        if (toolCall.type === 'function') {
          return {
            id: toolCall.id,
            name: toolCall.function.name,
            input: JSON.parse(toolCall.function.arguments),
          }
        }
        return {
          id: toolCall.id,
          name: 'unknown',
          input: {},
        }
      })

      return {
        content: messageContent,
        tool_uses: toolUses.length > 0 ? toolUses : undefined,
        stop_reason: firstChoice.finish_reason,
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error(`Failed to get response from OpenAI: ${error}`)
    }
  }

  async continueWithToolResult(
    conversationHistory: ChatMessage[],
    toolResults: ToolResult[],
    tools?: Tool[]
  ): Promise<AIResponse> {
    try {
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        })),
      ]

      // Add tool results as tool messages
      toolResults.forEach((result) => {
        messages.push({
          role: 'tool',
          tool_call_id: result.tool_use_id,
          content: result.content,
        })
      })

      const requestParams: OpenAI.ChatCompletionCreateParams = {
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages,
        max_tokens: 4096,
      }

      if (tools && tools.length > 0) {
        requestParams.tools = tools.map((tool) => ({
          type: 'function' as const,
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
          },
        }))
      }

      const response = await this.client.chat.completions.create(requestParams)

      const firstChoice = response.choices[0]
      const messageContent = firstChoice.message.content || ''

      return {
        content: messageContent,
        stop_reason: firstChoice.finish_reason,
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error(`Failed to continue with tool result: ${error}`)
    }
  }
}
