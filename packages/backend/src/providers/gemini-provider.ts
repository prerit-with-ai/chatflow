import { GoogleGenerativeAI } from '@google/generative-ai'
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

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini'
  private client: GoogleGenerativeAI
  private model: any

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    this.model = this.client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    })
  }

  validateConfig(): void {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        'GEMINI_API_KEY is required. Get your key at https://makersuite.google.com/app/apikey'
      )
    }
  }

  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = [],
    tools?: Tool[]
  ): Promise<AIResponse> {
    try {
      // Build conversation history
      const history = conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))

      const chat = this.model.startChat({
        history,
        systemInstruction: SYSTEM_PROMPT,
      })

      // Add tools if provided (Gemini uses function declarations)
      let generationConfig: any = {}
      if (tools && tools.length > 0) {
        generationConfig.tools = [
          {
            functionDeclarations: tools.map((tool) => ({
              name: tool.name,
              description: tool.description,
              parameters: tool.input_schema,
            })),
          },
        ]
      }

      const result = await chat.sendMessage(message)
      const response = result.response

      // Extract text content
      const textContent = response.text()

      // Extract function calls if any
      const functionCalls = response.functionCalls?.() || []
      const toolUses: ToolUse[] = functionCalls.map((call: any, index: number) => ({
        id: `tool_${Date.now()}_${index}`, // Gemini doesn't provide IDs, so generate one
        name: call.name,
        input: call.args,
      }))

      return {
        content: textContent,
        tool_uses: toolUses.length > 0 ? toolUses : undefined,
        stop_reason: 'stop',
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error(`Failed to get response from Gemini: ${error}`)
    }
  }

  async continueWithToolResult(
    conversationHistory: ChatMessage[],
    toolResults: ToolResult[]
  ): Promise<AIResponse> {
    try {
      // Build conversation history
      const history = conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))

      const chat = this.model.startChat({
        history,
        systemInstruction: SYSTEM_PROMPT,
      })

      // Send function responses
      const functionResponses = toolResults.map((result) => ({
        name: result.tool_use_id,
        response: {
          content: result.content,
        },
      }))

      const result = await chat.sendMessage([
        {
          functionResponse: functionResponses[0],
        },
      ])

      const response = result.response
      const textContent = response.text()

      return {
        content: textContent,
        stop_reason: 'stop',
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error(`Failed to continue with tool result: ${error}`)
    }
  }
}
