# AI Provider Type System

This directory contains TypeScript interfaces and types for the multi-provider AI system.

## Overview

ChatFlow uses a **provider abstraction pattern** to support multiple AI providers (Anthropic, OpenAI, Google) with a single unified interface.

## Files

### `ai-provider.ts`

Defines the core interfaces that all AI providers must implement:

- **`AIProvider`** - Main interface all providers implement
- **`ChatMessage`** - Universal message format
- **`Tool`** - MCP tool definition
- **`ToolUse`** - When AI decides to use a tool
- **`ToolResult`** - Result from tool execution
- **`AIResponse`** - Provider response format
- **`AIProviderType`** - Supported provider enum

## Provider Interface

All providers implement:

```typescript
interface AIProvider {
  readonly name: string
  sendMessage(message, history?, tools?): Promise<AIResponse>
  continueWithToolResult(history, results, tools?): Promise<AIResponse>
  validateConfig(): void
}
```

## Adding a New Provider

To add support for a new AI provider:

1. Create `src/providers/your-provider.ts`
2. Implement the `AIProvider` interface
3. Add to `AIProviderType` enum
4. Update factory in `src/providers/index.ts`
5. Update documentation

Example:

```typescript
import { AIProvider, ChatMessage, Tool, AIResponse } from '../types/ai-provider.js'

export class YourProvider implements AIProvider {
  readonly name = 'your-provider'

  validateConfig(): void {
    if (!process.env.YOUR_PROVIDER_API_KEY) {
      throw new Error('YOUR_PROVIDER_API_KEY required')
    }
  }

  async sendMessage(
    message: string,
    conversationHistory?: ChatMessage[],
    tools?: Tool[]
  ): Promise<AIResponse> {
    // Your implementation
  }

  async continueWithToolResult(
    conversationHistory: ChatMessage[],
    toolResults: ToolResult[],
    tools?: Tool[]
  ): Promise<AIResponse> {
    // Your implementation
  }
}
```

## Type Conversions

Each provider converts between MCP's universal format and their native format:

**MCP Tool → Anthropic:** Direct mapping (Anthropic created MCP)
**MCP Tool → OpenAI:** Convert to `function` calling format
**MCP Tool → Gemini:** Convert to `functionDeclarations` format

See provider implementations for details.
