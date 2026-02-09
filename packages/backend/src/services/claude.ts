import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

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

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ]

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
    })

    const firstContent = response.content[0]
    if (firstContent.type === 'text') {
      return firstContent.text
    }

    return 'I apologize, but I received an unexpected response format.'
  } catch (error) {
    console.error('Claude API error:', error)
    throw new Error('Failed to get response from Claude')
  }
}
