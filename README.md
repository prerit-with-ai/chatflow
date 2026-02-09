# ChatFlow - AI-Powered Service Integration Assistant

ChatFlow is an AI-powered assistant that helps you automate tasks across multiple services (Supabase, GitHub, etc.) through natural language conversations.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ LTS
- npm 10+
- **API key from ONE of these providers:**
  - **Anthropic** ([Claude](https://console.anthropic.com/)) - Default
  - **OpenAI** ([GPT-4](https://platform.openai.com/))
  - **Google** ([Gemini](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure backend environment**:
   ```bash
   cd packages/backend
   cp .env.example .env
   ```

   **Choose your AI provider** and add the corresponding API key:

   **Option A: Anthropic (Claude) - Default**
   ```env
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

   **Option B: OpenAI (GPT-4)**
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-key-here
   ```

   **Option C: Google (Gemini)**
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your-key-here
   ```

   See [MULTI_PROVIDER_GUIDE.md](./MULTI_PROVIDER_GUIDE.md) for details.

3. **Start the application**:

   **Option 1: Start both frontend and backend together**
   ```bash
   # From project root
   npm run dev
   ```

   **Option 2: Start separately (in different terminals)**
   ```bash
   # Terminal 1 - Backend
   cd packages/backend
   npm run dev

   # Terminal 2 - Frontend
   cd packages/frontend
   npm run dev
   ```

4. **Open your browser**:
   ```
   http://localhost:5173
   ```

## 🎯 Current Features (Slice 1)

- ✅ Floating chat button interface
- ✅ **Multi-provider AI support** (Anthropic, OpenAI, Google)
- ✅ Real-time chat with AI
- ✅ Responsive design
- ✅ Clean, modern UI with shadcn/ui components
- ✅ Provider-agnostic architecture (ready for MCP)

## 🗺️ Roadmap

### Slice 2: MCP Integration
- Add Model Context Protocol (MCP) server support
- Demonstrate tool calling with example MCP server

### Slice 3: Supabase Integration
- Create Supabase projects via chat
- Retrieve API keys
- Manage databases

### Slice 4: Credential Vault
- Secure encrypted storage for API keys
- Automatic credential injection

### Slice 5: Conversation History
- Persistent conversations across sessions
- Conversation management

### Slice 6: Production Ready
- Error handling
- Rate limiting
- Comprehensive documentation
- Deployment guides

## 📁 Project Structure

```
chatflow/
├── packages/
│   ├── frontend/          # React + Vite + Tailwind
│   │   ├── src/
│   │   │   ├── components/    # UI components
│   │   │   ├── lib/          # Utilities, API client, state
│   │   │   └── types/        # TypeScript types
│   │   └── package.json
│   └── backend/           # Express + Claude API
│       ├── src/
│       │   ├── routes/       # API endpoints
│       │   ├── services/     # Business logic
│       │   └── config/       # Configuration
│       └── package.json
├── CLAUDE.md              # Project context & architecture
├── CONTEXT.md             # Development progress tracker
└── package.json           # Workspace root
```

## 🛠️ Development

### Available Scripts

**Root workspace**:
- `npm run dev` - Start all packages in development mode
- `npm run build` - Build all packages
- `npm run clean` - Clean all node_modules and build outputs

**Frontend** (`packages/frontend`):
- `npm run dev` - Start Vite dev server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend** (`packages/backend`):
- `npm run dev` - Start Express server with auto-reload (http://localhost:3000)
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server

### Testing the Chat

Try these example messages:
- "Hello, what can you help me with?"
- "Tell me about ChatFlow's capabilities"
- "What integrations will you support?"

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive project context, architecture decisions, and development patterns
- **[CONTEXT.md](./CONTEXT.md)** - Current development status and progress tracker

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **shadcn/ui** for accessible UI components
- **Tailwind CSS** for styling
- **Zustand** for state management

### Backend
- **Express.js** with TypeScript
- **Multi-provider AI support:**
  - Anthropic SDK (Claude)
  - OpenAI SDK (GPT-4)
  - Google Generative AI (Gemini)
- **Provider abstraction layer** with factory pattern
- **MCP SDK** (ready) for tool integration

### Communication
- REST API for chat messages
- Server-Sent Events (SSE) for streaming (upcoming)

## 🔐 Environment Variables

### Backend (`.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# AI Provider (choose one)
AI_PROVIDER=anthropic  # or openai, gemini

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# OpenAI (GPT-4)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview  # optional

# Google Gemini
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-1.5-pro  # optional

# Future slices
DATABASE_URL=postgresql://postgres:password@localhost:5432/chatflow
ENCRYPTION_KEY=your-32-byte-hex-key
SUPABASE_MANAGEMENT_TOKEN=your-token
```

**See [MULTI_PROVIDER_GUIDE.md](./MULTI_PROVIDER_GUIDE.md) for provider comparison and setup details.**

## 🤝 Contributing

This is a project following the vertical slice architecture. Each slice builds a complete end-to-end feature.

When making changes:
1. Read relevant files before modifying
2. Make minimal, focused changes
3. Update documentation (CLAUDE.md, CONTEXT.md) for architectural changes
4. Test manually before committing

## 📝 License

MIT

## 🆘 Troubleshooting

### Port already in use
If port 3000 or 5173 is already in use, change the port in:
- Backend: `packages/backend/.env` → `PORT=3001`
- Frontend: `packages/frontend/vite.config.ts` → `server.port`

### CORS errors
Make sure both frontend and backend are running. The frontend proxies `/api` requests to the backend.

### API key not working
1. Verify your Anthropic API key is correct in `packages/backend/.env`
2. Restart the backend server after changing `.env`
3. Check backend console for error messages

### Dependencies not installing
Try:
```bash
npm run clean
npm install
```

---

**Built with Claude Code** 🤖
