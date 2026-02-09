import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRouter from './routes/chat.js'
import { getSupportedProviders } from './providers/index.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/chat', chatRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    provider: process.env.AI_PROVIDER || 'anthropic'
  })
})

// Get supported providers
app.get('/api/providers', (_req, res) => {
  res.json({
    current: process.env.AI_PROVIDER || 'anthropic',
    supported: getSupportedProviders()
  })
})

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ChatFlow backend running on http://localhost:${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV}`)
  console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'anthropic'}`)
  console.log(`📋 Supported providers: ${getSupportedProviders().join(', ')}`)

  // Check which API key is configured
  const provider = (process.env.AI_PROVIDER || 'anthropic').toLowerCase()
  if (provider === 'anthropic') {
    console.log(`🔑 Anthropic API key: ${process.env.ANTHROPIC_API_KEY ? '✓ Set' : '✗ Missing'}`)
  } else if (provider === 'openai') {
    console.log(`🔑 OpenAI API key: ${process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing'}`)
  } else if (provider === 'gemini') {
    console.log(`🔑 Gemini API key: ${process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing'}`)
  }
})
