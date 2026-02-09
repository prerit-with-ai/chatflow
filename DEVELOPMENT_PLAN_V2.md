# ChatFlow Development Plan V2 (User Journey First)

**Approach**: Start from user's perspective, build foundation → landing → auth → features

---

## ✅ Sprint 1: Foundation & Multi-Provider Setup (COMPLETE)

**What we built:**
- ✅ Monorepo structure (frontend + backend)
- ✅ Multi-provider AI system (Anthropic, OpenAI, Gemini)
- ✅ Basic chat interface (floating button + chat window)
- ✅ TypeScript configuration
- ✅ Comprehensive documentation
- ✅ Git repository + pushed to GitHub

**Status**: Backend running on port 3001, frontend on 5173

---

## 🎯 Sprint 2: Landing Page + Public Experience

**User Journey**: First-time visitor lands on website → understands product → wants to sign up

### Goals
- Professional landing page that sells the vision
- Clear value proposition
- Example use cases
- Call-to-action for signup
- SEO-friendly structure

### Tasks

#### 1. Landing Page Design (User-Facing)
- [ ] **Hero Section**
  - Compelling headline: "Automate Your Workflows with AI"
  - Subheadline: Value proposition
  - Primary CTA: "Get Started Free"
  - Secondary CTA: "See Demo"
  - Hero image/animation (optional)

- [ ] **Features Section**
  - "Multi-Provider AI" - Works with Claude, GPT-4, Gemini
  - "Secure Credential Vault" - Encrypted storage
  - "Natural Language Control" - Just chat to automate
  - "MCP Integration" - Connect to any service
  - Each feature with icon + description

- [ ] **Use Cases / Examples**
  - "Create a Supabase project" → Show the flow
  - "Query my database" → Show AI understanding
  - "Manage API keys" → Show security
  - Interactive demo (optional for later)

- [ ] **How It Works** (3-step explainer)
  - Step 1: Connect your services
  - Step 2: Chat naturally
  - Step 3: AI automates everything

- [ ] **Pricing** (placeholder for now)
  - Free tier: X requests/month
  - Pro: Unlimited (future)

- [ ] **Footer**
  - Links: Docs, GitHub, About, Privacy, Terms
  - Social media (if applicable)
  - Newsletter signup (optional)

#### 2. Frontend Components
```
packages/frontend/src/
├── pages/
│   ├── Home.tsx                 # Landing page (NEW)
│   ├── Login.tsx                # Login page (Sprint 3)
│   └── Dashboard.tsx            # Main app (current chat)
├── components/
│   ├── landing/
│   │   ├── Hero.tsx            # NEW
│   │   ├── Features.tsx        # NEW
│   │   ├── UseCases.tsx        # NEW
│   │   ├── HowItWorks.tsx      # NEW
│   │   ├── Pricing.tsx         # NEW
│   │   └── Footer.tsx          # NEW
│   └── chat/                    # Move existing chat components here
│       ├── FloatingChatButton.tsx
│       ├── ChatWindow.tsx
│       ├── MessageList.tsx
│       └── MessageInput.tsx
└── App.tsx                      # Add routing (React Router)
```

#### 3. Routing Setup
- [ ] Install `react-router-dom`
- [ ] Set up routes:
  - `/` → Landing page
  - `/login` → Login (Sprint 3)
  - `/signup` → Signup (Sprint 3)
  - `/app` → Dashboard with chat (protected, Sprint 3)
- [ ] Add navigation component
- [ ] Add route protection (after auth in Sprint 3)

#### 4. Styling & Branding
- [ ] Choose brand colors (primary, secondary, accent)
- [ ] Design logo (or use text logo for now)
- [ ] Create consistent button styles
- [ ] Animations (subtle, professional)
- [ ] Responsive breakpoints (mobile, tablet, desktop)

#### 5. SEO & Meta
- [ ] Page titles and descriptions
- [ ] Open Graph tags
- [ ] Favicon
- [ ] Sitemap (optional)

### Files to Create
```
packages/frontend/src/pages/Home.tsx
packages/frontend/src/components/landing/Hero.tsx
packages/frontend/src/components/landing/Features.tsx
packages/frontend/src/components/landing/UseCases.tsx
packages/frontend/src/components/landing/HowItWorks.tsx
packages/frontend/src/components/landing/Pricing.tsx
packages/frontend/src/components/landing/Footer.tsx
packages/frontend/src/components/layout/Navigation.tsx
```

### Acceptance Criteria
- [ ] Landing page looks professional and trustworthy
- [ ] Clear value proposition within 5 seconds
- [ ] Works on mobile, tablet, desktop
- [ ] CTA buttons are prominent and functional
- [ ] Fast page load (<2s)
- [ ] Accessible (semantic HTML, ARIA labels)

---

## 🎯 Sprint 3: Authentication & User Management

**User Journey**: User clicks "Get Started" → Creates account → Logs in → Sees dashboard

### Goals
- Secure authentication system
- User registration and login
- Session management
- Protected routes
- User profile

### Backend Tasks

#### 1. Database Setup
- [ ] Set up PostgreSQL (Docker Compose)
- [ ] Create Prisma schema:
  ```prisma
  model User {
    id            String      @id @default(uuid())
    email         String      @unique
    passwordHash  String
    name          String?
    createdAt     DateTime    @default(now())
    updatedAt     DateTime    @updatedAt

    conversations Conversation[]
    credentials   Credential[]
  }

  model Session {
    id        String   @id @default(uuid())
    userId    String
    user      User     @relation(fields: [userId], references: [id])
    token     String   @unique
    expiresAt DateTime
    createdAt DateTime @default(now())
  }
  ```
- [ ] Run migrations

#### 2. Authentication API
- [ ] **POST /api/auth/signup**
  - Email validation
  - Password hashing (bcrypt)
  - Create user record
  - Return JWT token
- [ ] **POST /api/auth/login**
  - Verify credentials
  - Create session
  - Return JWT token
- [ ] **POST /api/auth/logout**
  - Invalidate session
- [ ] **GET /api/auth/me**
  - Return current user (from JWT)
- [ ] **POST /api/auth/refresh**
  - Refresh JWT token

#### 3. Middleware
- [ ] **authMiddleware** - Verify JWT on protected routes
- [ ] **validateUser** - Attach user to request object
- [ ] Rate limiting on auth endpoints

#### 4. Security
- [ ] Password requirements (min 8 chars, etc.)
- [ ] Email verification (optional for V1)
- [ ] Password reset flow (optional for V1)
- [ ] CSRF protection
- [ ] Rate limiting on login attempts

### Frontend Tasks

#### 1. Auth Pages
- [ ] **Login Page** (`/login`)
  - Email/password form
  - "Forgot password?" link (placeholder)
  - "Don't have an account? Sign up"
  - Social login buttons (placeholder for future)
- [ ] **Signup Page** (`/signup`)
  - Email/password/confirm password
  - Name field
  - Terms checkbox
  - "Already have an account? Login"
- [ ] **Forgot Password** (optional for V1)

#### 2. Auth State Management
- [ ] Create auth context/hooks
  ```typescript
  // useAuth.ts
  const useAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const login = async (email, password) => { ... }
    const signup = async (email, password, name) => { ... }
    const logout = async () => { ... }

    return { user, loading, login, signup, logout }
  }
  ```
- [ ] Store JWT in localStorage (or httpOnly cookie)
- [ ] Auto-refresh token before expiry
- [ ] Redirect to login if unauthorized

#### 3. Protected Routes
- [ ] Create `ProtectedRoute` component
- [ ] Wrap `/app/*` routes
- [ ] Redirect to `/login` if not authenticated
- [ ] Show loading state while checking auth

#### 4. Dashboard/App Layout
- [ ] Top navigation bar with:
  - Logo/brand
  - User avatar/name
  - Dropdown menu (Profile, Settings, Logout)
- [ ] Sidebar (optional for V1)
- [ ] Main content area with chat

### Files to Create
```
Backend:
packages/backend/src/routes/auth.ts
packages/backend/src/middleware/auth.ts
packages/backend/src/services/auth.ts
packages/backend/prisma/schema.prisma
packages/backend/docker-compose.yml

Frontend:
packages/frontend/src/pages/Login.tsx
packages/frontend/src/pages/Signup.tsx
packages/frontend/src/pages/Dashboard.tsx
packages/frontend/src/hooks/useAuth.ts
packages/frontend/src/contexts/AuthContext.tsx
packages/frontend/src/components/auth/ProtectedRoute.tsx
packages/frontend/src/components/layout/AppLayout.tsx
packages/frontend/src/components/layout/TopNav.tsx
```

### Acceptance Criteria
- [ ] User can create an account
- [ ] User can log in with email/password
- [ ] JWT token is stored and used for requests
- [ ] Protected routes redirect to login if not authenticated
- [ ] User can log out
- [ ] Session persists across page refreshes
- [ ] Password is hashed (never stored plaintext)

---

## 🎯 Sprint 4: Chat Dashboard (Main App)

**User Journey**: Logged-in user → Opens dashboard → Chats with AI → Automates tasks

### Goals
- Move existing chat to authenticated dashboard
- Conversation history (save chats)
- Multiple conversations
- Conversation management
- AI responds to user's messages

### Backend Tasks

#### 1. Conversation API
- [ ] Update Prisma schema:
  ```prisma
  model Conversation {
    id        String    @id @default(uuid())
    userId    String
    user      User      @relation(fields: [userId], references: [id])
    title     String?   # Auto-generated from first message
    createdAt DateTime  @default(now())
    updatedAt DateTime  @updatedAt
    messages  Message[]
  }

  model Message {
    id             String       @id @default(uuid())
    conversationId String
    conversation   Conversation @relation(fields: [conversationId], references: [id])
    role           String       # "user" | "assistant"
    content        Json         # Array of content blocks
    createdAt      DateTime     @default(now())
  }
  ```
- [ ] **GET /api/conversations** - List user's conversations
- [ ] **POST /api/conversations** - Create new conversation
- [ ] **GET /api/conversations/:id** - Get conversation with messages
- [ ] **DELETE /api/conversations/:id** - Delete conversation
- [ ] **PUT /api/conversations/:id** - Update (e.g., rename)

#### 2. Update Chat API
- [ ] **POST /api/chat** - Save messages to database
  - Create conversation if new
  - Save user message
  - Get AI response
  - Save AI message
  - Return response
- [ ] Associate chat with current user (from JWT)
- [ ] Load conversation history for context

### Frontend Tasks

#### 1. Dashboard Layout
- [ ] **Sidebar** (left side, 250px)
  - "New Chat" button
  - List of past conversations
  - Search conversations (optional)
  - Folder/categories (optional for later)
- [ ] **Main Chat Area** (right side, flex-grow)
  - Chat header (conversation title, edit, delete)
  - Message list (existing component)
  - Message input (existing component)
- [ ] **Empty State** (no conversation selected)
  - Welcome message
  - Example prompts
  - "Start a new conversation"

#### 2. Conversation Management
- [ ] Click conversation → Load messages
- [ ] "New Chat" → Clear messages, create new conversation
- [ ] Auto-save new messages to current conversation
- [ ] Generate conversation title from first message (AI)
- [ ] Delete conversation with confirmation
- [ ] Rename conversation (inline edit)

#### 3. UI Improvements
- [ ] Show typing indicator when AI is thinking
- [ ] Markdown rendering in messages
- [ ] Code syntax highlighting (if AI returns code)
- [ ] Copy message button
- [ ] Regenerate response button
- [ ] Scroll to bottom on new message

### Files to Update/Create
```
Backend:
packages/backend/src/routes/conversations.ts (NEW)
packages/backend/src/routes/chat.ts (UPDATE - add DB save)
packages/backend/prisma/schema.prisma (UPDATE)

Frontend:
packages/frontend/src/pages/Dashboard.tsx (UPDATE)
packages/frontend/src/components/chat/ConversationSidebar.tsx (NEW)
packages/frontend/src/components/chat/ConversationList.tsx (NEW)
packages/frontend/src/components/chat/ChatHeader.tsx (NEW)
packages/frontend/src/hooks/useConversations.ts (NEW)
```

### Acceptance Criteria
- [ ] Logged-in user sees dashboard with sidebar
- [ ] Can create new conversations
- [ ] Can switch between conversations
- [ ] Messages persist across page refreshes
- [ ] Conversation title auto-generated
- [ ] Can delete conversations
- [ ] Can rename conversations
- [ ] Chat history shows previous messages

---

## 🎯 Sprint 5: Credential Vault (Secure Storage)

**User Journey**: AI creates Supabase project → Offers to save API keys → User accepts → Keys stored securely

### Goals
- Encrypted credential storage
- UI to manage stored credentials
- AI can save and retrieve credentials
- Inject credentials into tool execution

### Backend Tasks

#### 1. Vault Database Schema
- [ ] Update Prisma schema:
  ```prisma
  model Credential {
    id             String    @id @default(uuid())
    userId         String
    user           User      @relation(fields: [userId], references: [id])
    service        String    # "supabase", "github", etc.
    name           String    # User-friendly label
    encryptedValue String    # AES-256-GCM encrypted JSON
    iv             String    # Initialization vector
    metadata       Json?     # Non-sensitive metadata
    createdAt      DateTime  @default(now())
    updatedAt      DateTime  @updatedAt
    lastUsed       DateTime?

    @@unique([userId, service, name])
  }
  ```

#### 2. Vault Service
- [ ] **Encryption** (AES-256-GCM)
  ```typescript
  encrypt(plaintext: string): { encrypted: string, iv: string }
  decrypt(encrypted: string, iv: string): string
  ```
- [ ] Generate encryption key from env var
- [ ] Store/retrieve from database

#### 3. Vault API
- [ ] **POST /api/credentials** - Store new credential
- [ ] **GET /api/credentials** - List user's credentials (masked)
- [ ] **GET /api/credentials/:id** - Get specific credential (decrypted)
- [ ] **DELETE /api/credentials/:id** - Delete credential
- [ ] **PUT /api/credentials/:id** - Update credential

#### 4. AI Integration
- [ ] Add AI tool: `store_credential`
  - AI can offer to save credentials
  - User must approve
- [ ] Add AI tool: `retrieve_credential`
  - AI can fetch saved credentials
- [ ] Inject credentials into MCP server environments

### Frontend Tasks

#### 1. Credential Manager UI
- [ ] **Credentials Page** (`/app/credentials`)
  - List of stored credentials
  - Card view with service icon
  - Masked values (show/hide toggle)
  - Copy button
  - Delete button
- [ ] **Add Credential Modal**
  - Service dropdown (Supabase, GitHub, etc.)
  - Name field
  - Value field (password input)
  - Metadata (optional)
- [ ] **Edit Credential Modal**
  - Update name, value, metadata

#### 2. In-Chat Credential Saving
- [ ] When AI offers to save credentials:
  - Show confirmation dialog
  - Preview what will be saved
  - User approves/denies
- [ ] Show success notification after saving

#### 3. Security UI
- [ ] Mask sensitive values by default
- [ ] "Show" button requires additional confirmation
- [ ] Auto-hide after 30 seconds
- [ ] Warning banner about security

### Files to Create
```
Backend:
packages/backend/src/services/vault.ts
packages/backend/src/routes/credentials.ts
packages/backend/src/tools/vault-tools.ts

Frontend:
packages/frontend/src/pages/Credentials.tsx
packages/frontend/src/components/credentials/CredentialList.tsx
packages/frontend/src/components/credentials/CredentialCard.tsx
packages/frontend/src/components/credentials/AddCredentialModal.tsx
packages/frontend/src/hooks/useCredentials.ts
```

### Acceptance Criteria
- [ ] User can manually add credentials
- [ ] Credentials are encrypted in database
- [ ] AI can offer to save credentials (with user approval)
- [ ] User can view (decrypt) saved credentials
- [ ] User can delete credentials
- [ ] Credentials are masked by default
- [ ] Credentials are injected into MCP tools

---

## 🎯 Sprint 6: MCP Integration & Supabase Tools

**User Journey**: User: "Create a Supabase project called 'blog'" → AI uses MCP → Project created

### Goals
- MCP server architecture working
- Supabase MCP server integrated
- AI can execute real actions
- Tool results shown in chat

### Tasks

#### 1. MCP Client Infrastructure
- [ ] Create MCP client service
- [ ] Process manager for spawning MCP servers
- [ ] MCP server configuration file
- [ ] Tool discovery from MCP servers
- [ ] Tool execution routing

#### 2. Supabase MCP Server
- [ ] Create Supabase MCP server
  - `create_project` tool
  - `list_projects` tool
  - `get_api_keys` tool
  - `query_database` tool
- [ ] Test with real Supabase Management API
- [ ] Error handling

#### 3. AI Tool Calling Integration
- [ ] Update chat API to pass tools to AI provider
- [ ] Handle tool_use responses
- [ ] Execute tools via MCP
- [ ] Return tool results to AI
- [ ] Get final AI response

#### 4. Frontend Tool UI
- [ ] Show when AI is using a tool
- [ ] Display tool execution status
- [ ] Show tool results (formatted)
- [ ] Handle tool errors gracefully

### Acceptance Criteria
- [ ] MCP servers start automatically
- [ ] AI recognizes when to use tools
- [ ] "Create a Supabase project" actually works
- [ ] Tool results shown in chat
- [ ] Can retrieve API keys
- [ ] Can query database tables

---

## 🎯 Sprint 7: Polish & Production

**User Journey**: Smooth, professional experience with no rough edges

### Tasks
- [ ] Error handling everywhere
- [ ] Loading states for all async operations
- [ ] Empty states (no conversations, no credentials)
- [ ] Onboarding flow for new users
- [ ] Help/documentation in-app
- [ ] Keyboard shortcuts
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment configuration
- [ ] Monitoring and analytics

---

## Summary of Adjusted Approach

### Key Differences from Original Plan
1. **Landing page first** - Establish product presence before deep features
2. **Auth early** - Multi-user system from the start
3. **User-owned data** - Everything tied to user accounts
4. **Progressive disclosure** - Build foundation → layer features on top

### Why This Approach Works
- ✅ Validates product idea early (landing page)
- ✅ Real multi-user app (not single-user prototype)
- ✅ Each sprint delivers user-visible value
- ✅ Can launch to users earlier (after Sprint 3)
- ✅ Foundation is solid before adding complex features

### Current Status
- ✅ **Sprint 1 Complete** - Foundation & multi-provider AI
- 🎯 **Next**: Sprint 2 - Landing page

Ready to start Sprint 2? Let me know and I'll begin building the landing page! 🚀
