import { Router } from 'express'
import { createAIProvider, AIProvider } from '../providers/index.js'

const router = Router()

// Lazy provider initialization (only created when first request comes in)
let aiProvider: AIProvider | null = null

function getAIProvider(): AIProvider {
  if (!aiProvider) {
    aiProvider = createAIProvider()
  }
  return aiProvider
}

router.post('/', async (req, res): Promise<void> => {
  try {
    const { message, conversationHistory = [] } = req.body

    if (!message || typeof message !== 'string') {
      res.status(400).json({
        error: 'Invalid request',
        message: 'Message is required and must be a string',
      })
      return
    }

    // Get response from AI provider (lazy initialization)
    const provider = getAIProvider()
    const response = await provider.sendMessage(message, conversationHistory)

    res.json({
      message: response.content,
      timestamp: new Date().toISOString(),
      provider: provider.name,
    })
  } catch (error: any) {
    console.error('Chat error:', error)
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message,
    })
  }
})

export default router
