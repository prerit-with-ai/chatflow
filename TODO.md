# ChatFlow - Development TODO

## ✅ Completed

### Slice 0: Project Foundation
- [x] Monorepo structure with npm workspaces
- [x] TypeScript configuration
- [x] Dependencies installation
- [x] Git repository setup
- [x] Documentation (CLAUDE.md, CONTEXT.md, README.md, GETTING_STARTED.md)

### Slice 1: Basic Chat Interface
- [x] Frontend: Vite + React + TypeScript setup
- [x] Frontend: Tailwind CSS with shadcn/ui theme
- [x] Frontend: FloatingChatButton component
- [x] Frontend: ChatWindow component
- [x] Frontend: MessageList component
- [x] Frontend: MessageInput component
- [x] Frontend: Zustand store for state management
- [x] Frontend: API client
- [x] Backend: Express server setup
- [x] Backend: CORS and middleware
- [x] Backend: /api/chat endpoint
- [x] Backend: Claude API integration
- [x] Backend: Error handling
- [x] Backend: Request logging
- [x] Documentation updates

---

## 🚧 In Progress

### Immediate Action Required
- [ ] **Configure Anthropic API Key** in `packages/backend/.env`
- [ ] **Test the application** end-to-end

---

## 📋 Upcoming (Slice 2: MCP Integration)

### Backend Tasks
- [ ] Create `src/services/mcp-client.ts`
  - [ ] Implement `MCPClientManager` class
  - [ ] Add `connectToServer()` method
  - [ ] Add `listTools()` method
  - [ ] Add `callTool()` method
  - [ ] Add `disconnectAll()` method
- [ ] Create `src/services/process-manager.ts`
  - [ ] Spawn MCP server as child process
  - [ ] Handle stdin/stdout communication
  - [ ] Process lifecycle management
- [ ] Create `src/config/mcp-servers.json`
  - [ ] Configuration schema
  - [ ] Add calculator demo server
- [ ] Update `src/services/claude.ts`
  - [ ] Accept tools array parameter
  - [ ] Handle `tool_use` in response
  - [ ] Send tool results back to Claude
  - [ ] Get final response after tool execution
- [ ] Update `src/routes/chat.ts`
  - [ ] Initialize MCP client on startup
  - [ ] Discover tools from MCP servers
  - [ ] Convert MCP tools to Claude format
  - [ ] Handle tool calling flow

### Frontend Tasks
- [ ] Create `src/components/ToolUseIndicator.tsx`
  - [ ] Show when AI is using a tool
  - [ ] Display tool name and status
  - [ ] Loading animation
- [ ] Update `src/components/MessageList.tsx`
  - [ ] Render tool use indicators
  - [ ] Format tool results
  - [ ] Show tool execution status
- [ ] Update `src/types/message.ts`
  - [ ] Add tool use types
  - [ ] Add tool result types

### Testing
- [ ] Manual test: MCP server spawns correctly
- [ ] Manual test: Tools are discovered
- [ ] Manual test: "What's 5 + 3?" triggers calculator
- [ ] Manual test: Tool result displayed in chat
- [ ] Manual test: AI incorporates tool result

### Documentation
- [ ] Update CLAUDE.md with MCP implementation details
- [ ] Update CONTEXT.md with Slice 2 completion
- [ ] Update README.md with MCP examples

---

## 🔮 Future Slices

### Slice 3: Supabase Integration
- [ ] Find or create Supabase MCP server
- [ ] Implement tools:
  - [ ] `create_project`
  - [ ] `list_projects`
  - [ ] `get_api_keys`
  - [ ] `query_database`
- [ ] Add Supabase credentials to environment
- [ ] Create `SupabaseResult.tsx` component
- [ ] Create `CopyableCode.tsx` component
- [ ] Test Supabase project creation flow
- [ ] Update documentation

### Slice 4: Credential Vault
- [ ] Set up PostgreSQL with Docker Compose
- [ ] Create Prisma schema
  - [ ] User model
  - [ ] Credential model
- [ ] Run database migrations
- [ ] Create `src/services/vault.ts`
  - [ ] Encryption with AES-256-GCM
  - [ ] Decryption
  - [ ] Credential storage/retrieval
- [ ] Create `/api/credentials` endpoints
  - [ ] POST /api/credentials (create)
  - [ ] GET /api/credentials (list)
  - [ ] GET /api/credentials/:id (get)
  - [ ] DELETE /api/credentials/:id (delete)
- [ ] Add vault tools for Claude
  - [ ] `store_credential`
  - [ ] `retrieve_credential`
- [ ] Create `CredentialManager.tsx` component
- [ ] Create `CredentialList.tsx` component
- [ ] Test credential encryption/storage
- [ ] Update documentation

### Slice 5: Conversation History
- [ ] Update Prisma schema
  - [ ] Conversation model
  - [ ] Message model
- [ ] Run migrations
- [ ] Update `/api/chat` to save messages
- [ ] Create `/api/conversations` endpoints
  - [ ] GET /api/conversations (list)
  - [ ] GET /api/conversations/:id (get)
  - [ ] POST /api/conversations (create)
  - [ ] DELETE /api/conversations/:id (delete)
- [ ] Load conversation history on chat open
- [ ] Create `ConversationSidebar.tsx` component
- [ ] Create `ConversationList.tsx` component
- [ ] Add "New conversation" button
- [ ] Auto-generate conversation titles
- [ ] Test conversation persistence
- [ ] Update documentation

### Slice 6: Polish & Production Readiness
- [ ] Frontend polish
  - [ ] Error boundaries
  - [ ] Loading states everywhere
  - [ ] Empty states
  - [ ] Onboarding tour
  - [ ] Example command suggestions
  - [ ] Responsive design (mobile)
  - [ ] Keyboard shortcuts (Cmd+K, Esc)
- [ ] Backend polish
  - [ ] Comprehensive error handling
  - [ ] Request logging middleware
  - [ ] Rate limiting
  - [ ] Optimize system prompts
  - [ ] Health check endpoint (already done)
- [ ] Infrastructure
  - [ ] Docker Compose for full stack
  - [ ] Production Dockerfile
  - [ ] Environment variable validation
  - [ ] Deployment documentation
- [ ] Documentation
  - [ ] Complete README
  - [ ] Development setup guide
  - [ ] Deployment guide
  - [ ] API documentation
  - [ ] Architecture diagrams
- [ ] Final testing
  - [ ] End-to-end user flows
  - [ ] Error scenarios
  - [ ] Performance testing
  - [ ] Mobile testing

---

## 💡 Future Enhancements (Post-V1)

### Additional Features
- [ ] Desktop app (Electron wrapper)
- [ ] CLI tool (Commander.js)
- [ ] Additional MCP servers:
  - [ ] GitHub
  - [ ] Slack
  - [ ] Vercel
  - [ ] AWS
  - [ ] Filesystem
  - [ ] PostgreSQL/MongoDB
- [ ] MCP server marketplace
- [ ] Multi-modal support (images)
- [ ] Team features (shared conversations)
- [ ] Workflow automation
- [ ] Voice input
- [ ] MCP server visual editor
- [ ] Shared MCP server pool with Claude Desktop

### Technical Improvements
- [ ] Server-Sent Events for streaming responses
- [ ] WebSocket for real-time updates
- [ ] Frontend testing (React Testing Library)
- [ ] Backend testing (Jest)
- [ ] E2E testing (Playwright)
- [ ] CI/CD pipeline
- [ ] Monitoring and analytics
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility audit (WCAG)

---

## 📝 Notes

### Current Blockers
- Need Anthropic API key to test Slice 1

### Questions
- None currently

### Decisions Needed
- Which demo MCP server to use for Slice 2? (calculator vs echo)
  - **Recommendation**: Use `@modelcontextprotocol/server-calculator` from npm

---

**Last Updated**: 2026-02-09
**Current Focus**: Testing Slice 1, preparing for Slice 2
