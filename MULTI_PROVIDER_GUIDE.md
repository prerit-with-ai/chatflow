# ChatFlow Multi-Provider Guide

ChatFlow supports **multiple AI providers** thanks to MCP's provider-agnostic architecture. You can use:

- **Anthropic** (Claude 3.5 Sonnet, Opus, Haiku)
- **OpenAI** (GPT-4, GPT-4 Turbo, GPT-3.5)
- **Google** (Gemini 1.5 Pro, Gemini Pro)

## Why Multi-Provider Support?

MCP (Model Context Protocol) is an **open protocol** that works with any LLM provider. This gives you:

✅ **Flexibility** - Choose your preferred AI provider
✅ **Cost optimization** - Switch based on pricing
✅ **Availability** - Fallback if one provider has issues
✅ **Performance** - Use the best model for each task
✅ **No vendor lock-in** - Not tied to a single provider

---

## Quick Start: Choose Your Provider

### Option 1: Anthropic (Claude) - Default

**Best for:** Complex reasoning, long conversations, tool use

```env
# packages/backend/.env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key: https://console.anthropic.com/

**Models available:**
- `claude-3-5-sonnet-20241022` (default) - Best balance
- `claude-3-opus-20240229` - Most capable
- `claude-3-haiku-20240307` - Fastest, cheapest

### Option 2: OpenAI (GPT-4)

**Best for:** General purpose, broad knowledge, function calling

```env
# packages/backend/.env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

Get your key: https://platform.openai.com/

**Models available:**
- `gpt-4-turbo-preview` (default) - Latest GPT-4
- `gpt-4` - Standard GPT-4
- `gpt-3.5-turbo` - Faster, cheaper

### Option 3: Google Gemini

**Best for:** Multimodal, large context windows

```env
# packages/backend/.env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key-here
GEMINI_MODEL=gemini-1.5-pro
```

Get your key: https://makersuite.google.com/app/apikey

**Models available:**
- `gemini-1.5-pro` (default) - Most capable
- `gemini-pro` - Standard model

---

## Switching Between Providers

It's easy to switch! Just change the `AI_PROVIDER` in your `.env`:

```bash
# packages/backend/.env

# Use Claude
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Or use GPT-4
# AI_PROVIDER=openai
# OPENAI_API_KEY=sk-...

# Or use Gemini
# AI_PROVIDER=gemini
# GEMINI_API_KEY=...
```

Restart the backend and you're using the new provider!

---

## Provider Comparison

| Feature | Anthropic (Claude) | OpenAI (GPT-4) | Google (Gemini) |
|---------|-------------------|----------------|-----------------|
| **Tool Calling** | ✅ Excellent | ✅ Excellent | ✅ Good |
| **Context Length** | 200K tokens | 128K tokens | 1M tokens |
| **Speed** | Fast | Fast | Very Fast |
| **Cost (per 1M tokens)** | $15 in / $75 out | $10 in / $30 out | Free tier available |
| **Best For** | Reasoning, analysis | General purpose | Large context, multimodal |
| **MCP Support** | Native (created MCP) | Via adapter | Via adapter |

---

## Configuration Details

### Full Environment Configuration

```env
# Server
PORT=3000
NODE_ENV=development

# Choose your provider
AI_PROVIDER=anthropic  # or openai, gemini

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (GPT-4)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview  # optional, defaults to gpt-4-turbo-preview

# Google Gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-pro  # optional, defaults to gemini-1.5-pro
```

### Checking Active Provider

Start the backend and look for:

```
🤖 AI Provider: anthropic
📋 Supported providers: anthropic, openai, gemini
🔑 Anthropic API key: ✓ Set
```

Or call the API:

```bash
curl http://localhost:3000/api/providers
```

Response:
```json
{
  "current": "anthropic",
  "supported": ["anthropic", "openai", "gemini"]
}
```

---

## Provider-Specific Features

### Anthropic (Claude)

**Strengths:**
- Excellent at following instructions
- Strong reasoning capabilities
- Native MCP support
- Great for tool use

**Code Example:**
```typescript
// Already configured in AnthropicProvider
// Uses Claude's native tool calling format
```

### OpenAI (GPT-4)

**Strengths:**
- Broad general knowledge
- Fast inference
- Good function calling
- Wide ecosystem support

**Code Example:**
```typescript
// Automatically converts MCP tools to OpenAI function format
// tools → requestParams.tools (with type: 'function')
```

### Google Gemini

**Strengths:**
- Massive 1M token context window
- Free tier available
- Multimodal capabilities
- Very fast

**Code Example:**
```typescript
// Converts MCP tools to Gemini function declarations
// tools → generationConfig.tools.functionDeclarations
```

---

## How It Works Internally

### Provider Interface

All providers implement the same `AIProvider` interface:

```typescript
interface AIProvider {
  name: string
  sendMessage(message, history?, tools?): Promise<AIResponse>
  continueWithToolResult(history, results, tools?): Promise<AIResponse>
  validateConfig(): void
}
```

### Provider Factory

The factory pattern selects the right provider:

```typescript
// src/providers/index.ts
export function createAIProvider(providerType?: string): AIProvider {
  const provider = process.env.AI_PROVIDER || 'anthropic'

  switch (provider) {
    case 'anthropic':
      return new AnthropicProvider()
    case 'openai':
      return new OpenAIProvider()
    case 'gemini':
      return new GeminiProvider()
  }
}
```

### Tool Format Conversion

Each provider converts MCP tools to its native format:

**MCP Tool Format (Universal):**
```typescript
{
  name: "create_project",
  description: "Create a new project",
  input_schema: {
    type: "object",
    properties: { ... }
  }
}
```

**Anthropic (Native):**
```typescript
{
  name: "create_project",
  description: "Create a new project",
  input_schema: { ... }
}
```

**OpenAI (Function Calling):**
```typescript
{
  type: "function",
  function: {
    name: "create_project",
    description: "Create a new project",
    parameters: { ... }
  }
}
```

**Gemini (Function Declarations):**
```typescript
{
  functionDeclarations: [{
    name: "create_project",
    description: "Create a new project",
    parameters: { ... }
  }]
}
```

---

## Testing Different Providers

### Test with Anthropic
```bash
# .env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

npm run dev
# Chat: "Hello, which AI are you?"
# Response: "I'm Claude, made by Anthropic..."
```

### Test with OpenAI
```bash
# .env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

npm run dev
# Chat: "Hello, which AI are you?"
# Response: "I'm ChatGPT, an AI assistant by OpenAI..."
```

### Test with Gemini
```bash
# .env
AI_PROVIDER=gemini
GEMINI_API_KEY=...

npm run dev
# Chat: "Hello, which AI are you?"
# Response: "I'm Gemini, a conversational AI by Google..."
```

---

## Troubleshooting

### "Unknown AI provider" Error

**Problem:** Invalid `AI_PROVIDER` value

**Solution:**
```env
# Must be one of: anthropic, openai, gemini
AI_PROVIDER=anthropic  # ✓ Correct
AI_PROVIDER=claude     # ✗ Wrong (use 'anthropic')
AI_PROVIDER=gpt4       # ✗ Wrong (use 'openai')
```

### "API key required" Error

**Problem:** Missing API key for selected provider

**Solution:**
```env
# If AI_PROVIDER=anthropic, you need:
ANTHROPIC_API_KEY=sk-ant-...

# If AI_PROVIDER=openai, you need:
OPENAI_API_KEY=sk-...

# If AI_PROVIDER=gemini, you need:
GEMINI_API_KEY=...
```

### Provider Not Responding

**Problem:** API key invalid or network issues

**Solution:**
1. Verify API key is correct
2. Check your internet connection
3. Verify you have credits/quota remaining
4. Check provider status page:
   - Anthropic: https://status.anthropic.com/
   - OpenAI: https://status.openai.com/
   - Google: https://status.cloud.google.com/

---

## Cost Optimization

### Use Case Recommendations

**For Development:**
- Use **Gemini** (free tier) or **GPT-3.5-turbo** (cheapest)

**For Production:**
- Complex tasks: **Claude Opus** or **GPT-4**
- Simple tasks: **Claude Haiku** or **GPT-3.5-turbo**
- Large context: **Gemini 1.5 Pro** (1M tokens)

### Switching for Cost

```env
# Development (free/cheap)
AI_PROVIDER=gemini
# or
AI_PROVIDER=openai
OPENAI_MODEL=gpt-3.5-turbo

# Production (high quality)
AI_PROVIDER=anthropic
# or
AI_PROVIDER=openai
OPENAI_MODEL=gpt-4-turbo-preview
```

---

## Future: Multi-Provider in One Session

**Coming Soon:** Dynamic provider selection based on task:

```typescript
// Future feature
const response = await chat({
  message: "Complex reasoning task",
  preferredProvider: "anthropic"  // Use Claude for this
})

const simpleResponse = await chat({
  message: "Simple response",
  preferredProvider: "openai",
  model: "gpt-3.5-turbo"  // Cheaper for simple tasks
})
```

---

## Summary

✅ ChatFlow supports **3 major AI providers**
✅ Easy to switch via **environment variables**
✅ All providers work with **MCP tools**
✅ **No code changes** needed to switch
✅ **Provider-agnostic** architecture

**Choose the provider that best fits your needs:** performance, cost, features, or availability!

---

**Questions?** Check the main `README.md` or open an issue on GitHub.
