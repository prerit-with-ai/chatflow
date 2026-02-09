# ChatFlow - Project Context

**Last Updated**: 2026-02-09

## Project Overview

ChatFlow is an AI-powered service integration assistant that enables users to interact with external services (Supabase, GitHub, etc.) through natural language conversations. Instead of manually navigating multiple browser tabs and UIs, users can automate recurring workflows by chatting with an AI assistant.

**Core Value Proposition**: "Create a Supabase project called 'blog' and get me the API keys" → AI handles the entire workflow and stores credentials securely.

## Architecture Decisions

### 1. Model Context Protocol (MCP) Integration

**Decision**: Use MCP servers instead of building a custom plugin system.

**Rationale**:
- MCP is Anthropic's standard protocol for connecting Claude to external tools
- Process isolation provides better security (each MCP server runs as a separate child process)
- Language-agnostic: MCP servers can be written in any language
- Compatibility with Claude Desktop and the broader Claude ecosystem
- Ability to use existing community MCP servers
- Well-documented with official SDKs from Anthropic

**Implementation**:
```
Backend (MCP Client) ←→ Child Processes (MCP Servers)
     ↑                        ↓
  stdio/IPC              Supabase API
                        GitHub API
                        etc.
```

The backend spawns MCP servers as child processes, communicates via stdio (standard input/output), discovers available tools, and executes them on behalf of Claude.

### 2. Vertical Slice Architecture

**Decision**: Build in vertical slices, not horizontal layers.

**Rationale**:
- Each slice delivers a complete end-to-end user journey
- Reduces integration risk (no "big bang" integration at the end)
- Provides value incrementally
- Easier to test and validate with real user flows
- Better feedback loops

**Example Slice**: "Chat with AI" includes:
- Frontend: Chat UI components
- Backend: Express endpoint
- AI: Claude API integration
- All working together end-to-end

### 3. Monorepo Structure

**Decision**: Use npm workspaces with packages for frontend and backend.

**Structure**:
```
chatflow/
├── packages/
│   ├── frontend/          # React + Vite + shadcn/ui
│   ├── backend/           # Express + MCP Client + Prisma
│   └── shared/            # Shared TypeScript types (future)
├── package.json           # Workspace root
└── CLAUDE.md              # This file
```

**Rationale**:
- Shared dependency management
- Easy cross-package imports (future shared types)
- Single git repository
- Simplified CI/CD
- Extensible for future packages (CLI, desktop app, mobile)

### 4. Secure Credential Storage

**Decision**: Encrypt credentials with AES-256-GCM before storing in PostgreSQL.

**Implementation**:
- Each credential gets a unique IV (initialization vector)
- Encryption key stored in environment variable (never committed)
- Credentials injected into MCP server environment at runtime
- Never exposed in chat responses or logs

**Schema**:
```prisma
model Credential {
  id             String
  userId         String
  service        String   // "supabase", "github"
  name           String   // User-friendly label
  encryptedValue String   // AES-256-GCM encrypted JSON
  iv             String   // Initialization vector
  metadata       Json?    // Non-sensitive metadata
}
```

## Tech Stack Rationale

### Frontend
- **React 18**: Industry standard, great ecosystem
- **Vite**: Fast development experience, modern bundler
- **shadcn/ui**: Accessible, composable components (not a dependency, copy-paste)
- **Tailwind CSS**: Utility-first, easy customization
- **TanStack Query**: Server state management with caching
- **Zustand**: Lightweight client state (chat open/closed, UI preferences)

### Backend
- **Express**: Minimal, flexible, well-documented
- **TypeScript**: Type safety, better DX
- **Prisma**: Type-safe database access, great migrations
- **PostgreSQL**: Robust, supports JSON, encryption-friendly
- **Multi-Provider AI Support**:
  - **@anthropic-ai/sdk**: Claude (Sonnet, Opus, Haiku)
  - **openai**: GPT-4, GPT-3.5 Turbo
  - **@google/generative-ai**: Gemini 1.5 Pro, Gemini Pro
- **@modelcontextprotocol/sdk**: Official MCP implementation (provider-agnostic)

### Why Multi-Provider?
- **MCP is provider-agnostic** - Works with any LLM that supports tool calling
- **User choice** - Different users prefer different providers
- **Cost optimization** - Switch based on pricing and usage
- **Availability** - Fallback if one provider has issues
- **No vendor lock-in** - Not tied to a single AI company

### Why not Next.js?
- Wanted separation between frontend and backend for future multi-platform support
- Backend will be reused by CLI and desktop app (Electron)
- Server-side rendering not needed for this use case
- Express gives more control over MCP server lifecycle management

## Code Conventions

### File Naming
- Components: PascalCase (`ChatWindow.tsx`)
- Utilities: camelCase (`api.ts`, `vault.ts`)
- Configs: kebab-case (`mcp-servers.json`)
- Types: PascalCase (`types/Message.ts`)

### Component Structure
```typescript
// External imports first
import { useState } from 'react';

// Internal imports
import { Button } from '@/components/ui/button';
import { sendMessage } from '@/lib/api';

// Types
interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

// Component
export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  // Hooks first
  const [message, setMessage] = useState('');

  // Event handlers
  const handleSend = async () => {
    await sendMessage(message);
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Backend Structure
```typescript
// Route handlers should be thin
// Business logic in services/
// Database access in repositories/ (if needed)

// Example:
// routes/chat.ts → services/claude.ts → services/mcp-client.ts
```

### Error Handling
- Frontend: Use React Error Boundaries + toast notifications
- Backend: Centralized error middleware
- MCP Servers: Try/catch with structured error responses

### Environment Variables
- Never commit `.env` files
- Always provide `.env.example` with dummy values
- Use `dotenv` for local development
- Validate required env vars on server startup

## Database Schema Design

### Conversation Model
```prisma
model Conversation {
  id        String    @id @default(uuid())
  userId    String
  title     String?   // Auto-generated from first message
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
}
```

**Why JSON for message content?**
- Claude API returns content as array of blocks (text, tool_use, tool_result)
- Storing as JSON preserves structure
- Easier to render in frontend
- Supports future content types (images, files)

### Credential Model
```prisma
model Credential {
  id             String   @id @default(uuid())
  userId         String
  service        String   // "supabase", "github"
  name           String   // "production-api-key"
  encryptedValue String   // AES-256-GCM encrypted
  iv             String   // Initialization vector
  lastUsed       DateTime?

  @@unique([userId, service, name])
}
```

**Why unique constraint on (userId, service, name)?**
- Prevents duplicate credentials
- Users can have multiple credentials per service with different names
- Makes lookups efficient

## MCP Architecture Deep Dive

### Client-Server Communication

```typescript
// Backend spawns MCP server as child process
const process = spawn('node', ['./mcp-servers/supabase/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Create stdio transport (communication via stdin/stdout)
const transport = new StdioClientTransport({
  reader: process.stdout,
  writer: process.stdin
});

// Connect MCP client
const client = new Client({ name: 'chatflow-backend' }, { capabilities: {} });
await client.connect(transport);

// Discover tools
const { tools } = await client.listTools();

// Execute tool
const result = await client.callTool({
  name: 'create_supabase_project',
  arguments: { name: 'my-project', db_pass: 'secure123' }
});
```

### Tool Discovery and Execution Flow

1. **Server Startup**: Backend spawns MCP servers (configured in `mcp-servers.json`)
2. **Tool Discovery**: Backend calls `listTools()` on each MCP server
3. **Claude Integration**: Tools are converted to Claude's tool format and passed in API call
4. **Tool Use**: When Claude decides to use a tool, it returns a `tool_use` block
5. **Execution**: Backend routes the tool call to the appropriate MCP server
6. **Result**: MCP server executes and returns result
7. **Continuation**: Backend sends tool result back to Claude for final response

### MCP Server Configuration

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["./mcp-servers/supabase/index.js"],
      "env": {
        "SUPABASE_MANAGEMENT_TOKEN": "${SUPABASE_MANAGEMENT_TOKEN}"
      }
    },
    "calculator": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-calculator"]
    }
  }
}
```

**Environment Variable Injection**:
- `${VAR_NAME}` syntax loads from backend's environment
- Credentials from vault can be injected dynamically
- MCP servers run in isolated environment

## AI Integration Strategy

### System Prompt Design

```typescript
const systemPrompt = `You are ChatFlow, an AI assistant that helps users automate tasks across multiple services.

You have access to tools for:
- Supabase (create projects, query databases, manage API keys)
- [Future: GitHub, Slack, Vercel, etc.]

When users ask you to perform tasks:
1. Confirm your understanding of the request
2. Use the appropriate tools to complete the task
3. Summarize what you did
4. Offer to save any generated credentials for later use

IMPORTANT: Never expose full API keys or secrets in your responses. Instead, say "I've saved the API keys to your secure credential vault."

When referencing credentials, use masked format: "sup****key123"
`;
```

### Tool Calling Pattern

```typescript
// Initial message
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  tools: claudeTools,  // Tools from MCP servers
  messages: [{ role: 'user', content: userMessage }]
});

// If Claude wants to use a tool
if (response.stop_reason === 'tool_use') {
  const toolUse = response.content.find(b => b.type === 'tool_use');

  // Execute via MCP server
  const result = await mcpClient.callTool(
    toolUse.name,
    toolUse.input
  );

  // Continue conversation with tool result
  const finalResponse = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    tools: claudeTools,
    messages: [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: response.content },
      {
        role: 'user',
        content: [{
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: result.content[0].text
        }]
      }
    ]
  });
}
```

### Streaming Responses

For better UX, stream Claude's responses word-by-word:

```typescript
const stream = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  stream: true,
  messages: [{ role: 'user', content: userMessage }]
});

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    // Send delta to frontend via SSE
    res.write(`data: ${JSON.stringify(event.delta)}\n\n`);
  }
}
```

## Future Extensibility

### Desktop App (Electron)
- Reuse entire React frontend
- Backend runs locally (no Express server needed in packaged app)
- MCP servers bundled with app
- Can share MCP servers with Claude Desktop!

### CLI Tool
- Same backend MCP client
- Commander.js for CLI interface
- Stream responses to terminal with color/formatting
- Credentials stored in `~/.chatflow/credentials.db`

### Additional MCP Servers
ChatFlow can support any MCP server. Future integrations:
- **GitHub**: Repos, issues, PRs, actions
- **Slack**: Messages, channels, notifications
- **Vercel**: Deployments, projects, environment variables
- **AWS**: EC2, S3, Lambda management
- **Filesystem**: Read/write files (for local automation)
- **Databases**: Direct PostgreSQL/MongoDB access

To add a new MCP server:
1. Install or create the MCP server
2. Add to `mcp-servers.json` configuration
3. Backend automatically discovers and exposes tools
4. No code changes needed!

## Testing Strategy

### Frontend
- Component testing with React Testing Library
- E2E testing with Playwright (future)
- Manual testing for UX/polish

### Backend
- Unit tests for services (mcp-client, vault)
- Integration tests for API endpoints
- MCP server mocks for testing

### MCP Servers
- Unit tests for individual tools
- Integration tests with real APIs (using test accounts)
- Mocked external API responses

## Development Workflow

### Starting Development
```bash
# Terminal 1: Backend
cd packages/backend
npm run dev

# Terminal 2: Frontend
cd packages/frontend
npm run dev

# Terminal 3: Database
docker-compose up postgres
```

### Making Changes
1. Read relevant files first (don't guess at implementation)
2. Make minimal changes (no over-engineering)
3. Test the change manually
4. Update documentation if architecture changes

### Git Workflow
- Commit frequently with descriptive messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- No force-pushing to main

## Common Patterns

### Adding a New API Endpoint

```typescript
// 1. Create route handler (packages/backend/src/routes/example.ts)
import { Router } from 'express';

const router = Router();

router.post('/example', async (req, res) => {
  try {
    const result = await exampleService.doSomething(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

// 2. Register in server.ts
import exampleRouter from './routes/example.js';
app.use('/api/example', exampleRouter);

// 3. Create frontend API client function (packages/frontend/src/lib/api.ts)
export async function callExample(data: ExampleData) {
  const response = await fetch('/api/example', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// 4. Use in component with React Query
const { mutate } = useMutation({
  mutationFn: callExample,
  onSuccess: (data) => {
    console.log('Success:', data);
  }
});
```

### Adding a shadcn/ui Component

```bash
# Use the CLI (recommended)
cd packages/frontend
npx shadcn@latest add button

# Component is added to src/components/ui/button.tsx
# Import and use:
import { Button } from '@/components/ui/button';
```

### Encrypting/Decrypting Credentials

```typescript
// Encrypt
import { encrypt } from './services/vault.js';
const { encrypted, iv } = await encrypt(JSON.stringify({
  apiKey: 'sup_secret_key_123',
  projectRef: 'xyz123'
}));

// Store in database
await prisma.credential.create({
  data: {
    userId,
    service: 'supabase',
    name: 'production-api-key',
    encryptedValue: encrypted,
    iv
  }
});

// Decrypt
import { decrypt } from './services/vault.js';
const credential = await prisma.credential.findUnique({ where: { id } });
const decrypted = await decrypt(credential.encryptedValue, credential.iv);
const { apiKey, projectRef } = JSON.parse(decrypted);
```

## Troubleshooting

### MCP Server Won't Start
- Check `mcp-servers.json` configuration
- Verify command and args are correct
- Check environment variables are set
- Look at stderr output from child process

### Claude Not Using Tools
- Verify tools are properly formatted (check `inputSchema`)
- Check tool descriptions are clear and specific
- Ensure system prompt guides tool usage
- Try more explicit user instructions

### Database Connection Issues
- Verify PostgreSQL is running (`docker-compose ps`)
- Check `DATABASE_URL` in `.env`
- Run migrations (`npm run db:migrate`)
- Check Prisma client is generated (`npm run db:generate`)

### Frontend Can't Connect to Backend
- Check CORS configuration in backend
- Verify backend is running on expected port
- Check Vite proxy configuration (if using)
- Look for CORS errors in browser console

## Performance Considerations

### Frontend
- Lazy load chat window (only render when opened)
- Virtualize message list for long conversations
- Debounce user input
- Optimize re-renders with React.memo

### Backend
- Keep MCP server processes alive (don't spawn per-request)
- Implement connection pooling for database
- Cache tool definitions (no need to re-fetch every request)
- Stream responses to reduce perceived latency

### Database
- Index on `userId` for all user-scoped queries
- Index on `conversationId` for message queries
- Limit conversation history loaded (paginate old messages)

## Security Considerations

### Credential Vault
- Encryption key must be 32 bytes (256 bits)
- Unique IV for each credential
- Never log decrypted values
- Rotate encryption key periodically (future)

### MCP Server Isolation
- Each MCP server runs as separate process
- Limited environment variables (only what's needed)
- No access to filesystem outside designated directories
- Consider sandboxing (future: Docker containers per server)

### API Security
- Rate limiting on all endpoints
- JWT authentication (future: current V1 is single-user)
- HTTPS in production
- CORS restricted to frontend origin

### Input Validation
- Validate all user inputs
- Sanitize before passing to MCP servers
- Escape special characters in database queries (Prisma handles this)
- Validate tool arguments against schema

## Maintenance

### Updating Dependencies
```bash
# Check for outdated packages
npm outdated --workspaces

# Update all packages
npm update --workspaces

# Update specific package
npm install <package>@latest -w @chatflow/frontend
```

### Database Migrations
```bash
# Create new migration
cd packages/backend
npx prisma migrate dev --name add_new_field

# Apply migrations in production
npx prisma migrate deploy
```

### Backup and Recovery
- Regular PostgreSQL backups (automated in production)
- Export conversations and credentials
- Document backup/restore procedures (future)

---

**This document is a living guide. Update it whenever you make architectural decisions, add new patterns, or learn something important about the codebase.**
