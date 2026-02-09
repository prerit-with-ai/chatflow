# ChatFlow Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Web Frontend (React)                   │
│  - Floating chat UI                                      │
│  - Message history                                       │
│  - Provider-agnostic (doesn't know which AI)            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/JSON
┌────────────────────▼────────────────────────────────────┐
│               Express Backend (Node.js)                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  API Layer                                       │   │
│  │  - /api/chat    - Send messages                 │   │
│  │  - /api/health  - Health check                  │   │
│  │  - /api/providers - List supported providers    │   │
│  └──────────┬───────────────────────────────────────┘   │
│             │                                            │
│  ┌──────────▼────────────────────────────────────┐      │
│  │  Provider Abstraction Layer                    │      │
│  │  - AIProvider interface                        │      │
│  │  - Factory pattern (createAIProvider)          │      │
│  │  - Runtime provider selection                  │      │
│  └──────────┬───────────────────┬──────────┬──────┘      │
│             │                   │          │             │
│  ┌──────────▼──────┐  ┌────────▼────┐  ┌─▼─────────┐   │
│  │ AnthropicProvider│  │OpenAIProvider│  │GeminiProvider│  │
│  │ (Claude SDK)     │  │ (OpenAI SDK) │  │ (Google AI)  │  │
│  └──────────┬──────┘  └─────────┬────┘  └──┬───────┘   │
└───────────────┼───────────────────┼──────────┼──────────┘
                │                   │          │
        ┌───────▼────────┐  ┌──────▼─────┐  ┌▼────────┐
        │ Anthropic API  │  │ OpenAI API │  │Google AI│
        │ (Claude)       │  │ (GPT-4)    │  │(Gemini) │
        └────────────────┘  └────────────┘  └─────────┘
```

## Multi-Provider Design Pattern

### 1. Provider Interface (`AIProvider`)

All providers implement the same interface:

```typescript
interface AIProvider {
  readonly name: string
  sendMessage(message, history?, tools?): Promise<AIResponse>
  continueWithToolResult(history, results, tools?): Promise<AIResponse>
  validateConfig(): void
}
```

**Benefits:**
- **Polymorphism** - Backend doesn't care which provider is used
- **Dependency Inversion** - Depend on abstraction, not concrete implementations
- **Open/Closed Principle** - Open for extension (new providers), closed for modification

### 2. Factory Pattern

Provider instantiation is centralized:

```typescript
export function createAIProvider(providerType?: string): AIProvider {
  const provider = process.env.AI_PROVIDER || 'anthropic'

  switch (provider) {
    case 'anthropic': return new AnthropicProvider()
    case 'openai': return new OpenAIProvider()
    case 'gemini': return new GeminiProvider()
  }
}
```

**Benefits:**
- **Single Source of Truth** - One place to add new providers
- **Configuration-Driven** - Provider selection via environment variable
- **Validation** - Ensures provider is properly configured before use

### 3. Provider Implementations

Each provider:
1. Wraps the provider's SDK
2. Converts MCP universal format ↔ Provider native format
3. Handles provider-specific quirks
4. Validates required configuration

**Example: Anthropic Provider**
```typescript
export class AnthropicProvider implements AIProvider {
  private client: Anthropic

  async sendMessage(message, history, tools) {
    // Convert MCP tools to Anthropic format (direct mapping)
    const anthropicTools = tools.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema
    }))

    // Call Anthropic API
    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      tools: anthropicTools,
      messages: [...]
    })

    // Return universal format
    return { content: ..., tool_uses: ... }
  }
}
```

**Example: OpenAI Provider**
```typescript
export class OpenAIProvider implements AIProvider {
  private client: OpenAI

  async sendMessage(message, history, tools) {
    // Convert MCP tools to OpenAI function format
    const openAITools = tools.map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.input_schema
      }
    }))

    // Call OpenAI API
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      tools: openAITools,
      messages: [...]
    })

    // Return universal format
    return { content: ..., tool_uses: ... }
  }
}
```

## Request Flow

### Basic Chat (No Tools)

```
1. User types message in frontend
   ↓
2. Frontend sends POST /api/chat
   ↓
3. Backend routes to chat handler
   ↓
4. Handler calls aiProvider.sendMessage()
   ↓
5. Provider converts to native format
   ↓
6. Provider calls external API (Anthropic/OpenAI/Gemini)
   ↓
7. Provider converts response to universal format
   ↓
8. Backend returns JSON response
   ↓
9. Frontend displays message
```

### Tool Use Flow (Future - Slice 2)

```
1. User: "Create a Supabase project"
   ↓
2. POST /api/chat with message
   ↓
3. aiProvider.sendMessage(message, history, tools)
   ↓
4. Provider converts MCP tools to native format
   ↓
5. AI decides to use tool, returns tool_use
   ↓
6. Backend executes tool via MCP server
   ↓
7. aiProvider.continueWithToolResult(history, results)
   ↓
8. AI processes tool result, returns final response
   ↓
9. Frontend displays result
```

## Directory Structure

```
packages/backend/src/
├── types/
│   └── ai-provider.ts          # AIProvider interface & types
├── providers/
│   ├── index.ts                # Factory & exports
│   ├── anthropic-provider.ts   # Claude implementation
│   ├── openai-provider.ts      # GPT-4 implementation
│   └── gemini-provider.ts      # Gemini implementation
├── routes/
│   └── chat.ts                 # Chat endpoint (uses aiProvider)
└── server.ts                   # Express setup
```

## Type System

### Universal Types (MCP-Compatible)

```typescript
// Message format (works with all providers)
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Tool definition (MCP standard)
interface Tool {
  name: string
  description: string
  input_schema: Record<string, any>  // JSON Schema
}

// AI response (universal)
interface AIResponse {
  content: string
  tool_uses?: ToolUse[]
  stop_reason?: string
}
```

### Provider-Specific Types

Each provider SDK has its own types, which are internal to the provider implementation:

- **Anthropic:** `Anthropic.MessageParam`, `Anthropic.ToolUseBlock`
- **OpenAI:** `OpenAI.ChatCompletionMessageParam`, `OpenAI.ChatCompletionTool`
- **Gemini:** Custom types from `@google/generative-ai`

The provider implementations handle conversion between universal and native types.

## Configuration Management

### Environment-Based Selection

```env
# .env file
AI_PROVIDER=anthropic  # or openai, gemini

# Provider-specific config
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
```

### Runtime Validation

On server startup:
```typescript
const aiProvider = createAIProvider()  // Reads AI_PROVIDER env var
aiProvider.validateConfig()            // Throws if API key missing

console.log(`✅ AI Provider: ${aiProvider.name}`)
```

### Health Check

```bash
curl http://localhost:3000/api/health
{
  "status": "ok",
  "provider": "anthropic"
}

curl http://localhost:3000/api/providers
{
  "current": "anthropic",
  "supported": ["anthropic", "openai", "gemini"]
}
```

## Future Enhancements

### Dynamic Provider Selection (Per-Request)

```typescript
// Future API
POST /api/chat
{
  "message": "Hello",
  "provider": "openai",  // Override default
  "model": "gpt-3.5-turbo"  // Provider-specific config
}
```

### Provider Fallback

```typescript
// Future: Try multiple providers if one fails
const providers = ['anthropic', 'openai', 'gemini']
for (const provider of providers) {
  try {
    return await getProvider(provider).sendMessage(...)
  } catch (error) {
    continue  // Try next provider
  }
}
```

### Multi-Provider Tool Execution

```typescript
// Future: Route different tools to different providers
const complexTool = await claude.sendMessage(...)  // Use Claude for reasoning
const simpleTool = await gpt35.sendMessage(...)    // Use GPT-3.5 for simple tasks
```

## Design Principles

1. **Dependency Inversion** - Depend on `AIProvider` interface, not concrete classes
2. **Single Responsibility** - Each provider only handles its own SDK
3. **Open/Closed** - Add new providers without modifying existing code
4. **Provider Agnostic** - Frontend and routes don't know which provider is used
5. **Configuration Over Code** - Select provider via env var, not code changes

## Adding a New Provider

To add support for a new AI provider (e.g., Cohere, Anthropic v2, local models):

1. **Create provider class:**
   ```typescript
   // src/providers/cohere-provider.ts
   export class CohereProvider implements AIProvider {
     readonly name = 'cohere'
     // Implement interface methods
   }
   ```

2. **Add to factory:**
   ```typescript
   // src/providers/index.ts
   case 'cohere':
     return new CohereProvider()
   ```

3. **Add to enum:**
   ```typescript
   // src/types/ai-provider.ts
   export enum AIProviderType {
     ANTHROPIC = 'anthropic',
     OPENAI = 'openai',
     GEMINI = 'gemini',
     COHERE = 'cohere',  // New!
   }
   ```

4. **Update .env.example:**
   ```env
   COHERE_API_KEY=your-key-here
   ```

5. **Update documentation:**
   - Add to `MULTI_PROVIDER_GUIDE.md`
   - Update `README.md`

No changes needed to frontend, routes, or core backend logic!

---

**The multi-provider architecture demonstrates MCP's true power:** tool integrations work with ANY AI provider, not just one.
