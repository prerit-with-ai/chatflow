# Sprint 3: Service Selector UI + Supabase Integration (Phase 1)

**Sprint Goal**: Build service selector UX and begin Supabase integration with core project operations

**Duration**: 2 weeks (10 working days)
**Status**: 🟡 Planning
**Start Date**: TBD
**End Date**: TBD

---

## 🎯 Sprint Objectives

### Primary Goals
1. ✅ Build service selector UI (left sidebar in chat)
2. ✅ Implement OAuth connection flow for services
3. ✅ Create Supabase MCP server foundation
4. ✅ Implement 10-15 core Supabase operations
5. ✅ Users can perform basic Supabase project management via chat

### Success Metrics
- User can connect Supabase account (OAuth)
- User can create/list/delete Supabase projects via chat
- Service selector works smoothly (switch between services)
- <2 second response time for operations
- Zero errors on happy path

---

## 👤 User Journey

**As a developer, I want to**:
1. Open ChatFlow
2. Click "Connect Supabase"
3. Authorize ChatFlow via OAuth
4. See Supabase in my service list
5. Click Supabase to enter that context
6. Chat: "Create a project called blog-app"
7. Get project created + API keys returned
8. Never need to open Supabase dashboard

---

## 📋 Tasks Breakdown

### **Phase 1: Service Selector UI (Days 1-3)**

#### **Task 1.1: Update Chat Window Layout**
**File**: `packages/frontend/src/components/chat/ChatWindow.tsx`

**Requirements**:
- Split chat window into two sections:
  - Left: Service selector sidebar (200px width)
  - Right: Chat messages area
- Responsive: Collapse sidebar on mobile
- Clean visual separation

**Acceptance Criteria**:
- ✅ Sidebar visible on desktop
- ✅ Sidebar collapses to hamburger menu on mobile
- ✅ Smooth transition between states
- ✅ Maintains current chat functionality

**Estimated Time**: 4 hours

---

#### **Task 1.2: Create ServiceSelector Component**
**File**: `packages/frontend/src/components/chat/ServiceSelector.tsx`

**Features**:
```typescript
interface Service {
  id: string
  name: string
  icon: string
  connected: boolean
  status: 'active' | 'disconnected' | 'error'
}
```

**UI Elements**:
- List of services (with icons)
- Active service highlighted
- Connection status indicators
- "Connect Service" button
- Service context switcher

**Acceptance Criteria**:
- ✅ Shows list of services
- ✅ Highlights active service
- ✅ Shows connection status (connected/disconnected)
- ✅ Click service to switch context
- ✅ "Add Service" opens connection modal

**Estimated Time**: 6 hours

---

#### **Task 1.3: Service Context Management**
**File**: `packages/frontend/src/hooks/useServiceContext.ts`

**State Management**:
```typescript
interface ServiceContext {
  activeService: string | null  // 'supabase' | 'github' | null
  services: Service[]
  switchService: (serviceId: string) => void
  connectService: (serviceId: string) => void
  disconnectService: (serviceId: string) => void
}
```

**Acceptance Criteria**:
- ✅ Track active service
- ✅ Persist active service in localStorage
- ✅ API calls include service context
- ✅ Clear service context when switching

**Estimated Time**: 4 hours

---

#### **Task 1.4: Update Chat Messages with Service Context**
**File**: `packages/frontend/src/components/chat/MessageList.tsx`

**Changes**:
- Show service context in chat header
- Display which service AI is interacting with
- Service-specific message formatting

**Acceptance Criteria**:
- ✅ Header shows "Chatting with: Supabase"
- ✅ Service icon in header
- ✅ Messages clearly associated with service

**Estimated Time**: 2 hours

---

### **Phase 2: OAuth Connection Flow (Days 3-4)**

#### **Task 2.1: Service Connection Modal**
**File**: `packages/frontend/src/components/services/ConnectServiceModal.tsx`

**UI Flow**:
1. User clicks "Connect Service"
2. Modal shows available services (Supabase for now)
3. User clicks "Connect Supabase"
4. Redirected to Supabase OAuth page
5. After authorization, redirected back to ChatFlow
6. Service appears as "Connected" in sidebar

**Acceptance Criteria**:
- ✅ Modal lists available services
- ✅ Click initiates OAuth flow
- ✅ Handles OAuth callback correctly
- ✅ Shows success/error states
- ✅ Updates service list after connection

**Estimated Time**: 6 hours

---

#### **Task 2.2: Backend OAuth Endpoints**
**Files**:
- `packages/backend/src/routes/auth/oauth.ts`
- `packages/backend/src/services/oauth-manager.ts`

**Endpoints to Create**:

1. **GET `/api/auth/services`**
   - Returns list of available services
   - Returns OAuth URLs for connection

2. **GET `/api/auth/connect/:service`**
   - Redirects to service OAuth page
   - Example: `/api/auth/connect/supabase`

3. **GET `/api/auth/callback/:service`**
   - Handles OAuth callback
   - Exchanges code for tokens
   - Stores encrypted tokens
   - Redirects back to frontend

4. **POST `/api/auth/disconnect/:service`**
   - Revokes OAuth tokens
   - Removes from user's connected services

**Database Schema** (add to Prisma):
```prisma
model ServiceConnection {
  id                String   @id @default(uuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  service           String   // 'supabase', 'github', etc.
  accessToken       String   // Encrypted OAuth access token
  refreshToken      String?  // Encrypted OAuth refresh token
  tokenExpiry       DateTime?
  scopes            Json?    // Granted OAuth scopes
  metadata          Json?    // Service-specific metadata
  connected         Boolean  @default(true)
  lastUsed          DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([userId, service])
}
```

**Acceptance Criteria**:
- ✅ OAuth flow works end-to-end
- ✅ Tokens stored encrypted (AES-256-GCM)
- ✅ Token refresh logic implemented
- ✅ Can disconnect and reconnect services
- ✅ Database migrations run successfully

**Estimated Time**: 8 hours

---

#### **Task 2.3: OAuth Configuration for Supabase**

**Setup Required**:
1. Register OAuth app with Supabase (if supported)
   - Get Client ID
   - Get Client Secret
   - Set callback URL: `http://localhost:5173/auth/callback/supabase`

2. Add to `.env`:
   ```env
   SUPABASE_OAUTH_CLIENT_ID=xxx
   SUPABASE_OAUTH_CLIENT_SECRET=xxx
   SUPABASE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback/supabase
   ```

**Fallback** (if OAuth not available):
- User provides Access Token manually
- Store encrypted
- UI: "Connect with Access Token"

**Acceptance Criteria**:
- ✅ OAuth app registered (or fallback ready)
- ✅ Configuration documented
- ✅ Environment variables set

**Estimated Time**: 2 hours (setup) + 4 hours (fallback implementation if needed)

---

### **Phase 3: Supabase MCP Server Foundation (Days 5-6)**

#### **Task 3.1: MCP Server Project Structure**

**Create Directory**:
```
packages/mcp-servers/supabase/
├── src/
│   ├── index.ts              # MCP server entry
│   ├── server.ts             # Server setup
│   ├── tools/
│   │   └── projects.ts       # Project management tools
│   ├── api/
│   │   └── management.ts     # Supabase Management API client
│   └── types.ts              # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

**Dependencies**:
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "@supabase/supabase-js": "^2.39.0",
    "node-fetch": "^3.3.0"
  }
}
```

**Acceptance Criteria**:
- ✅ Project structure created
- ✅ Dependencies installed
- ✅ TypeScript compiles
- ✅ Basic MCP server can start

**Estimated Time**: 2 hours

---

#### **Task 3.2: Implement MCP Server Scaffolding**
**File**: `packages/mcp-servers/supabase/src/index.ts`

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new Server(
  {
    name: 'supabase-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// Register tools/list handler
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      // Will add tools here
    ],
  }
})

// Register tools/call handler
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params

  // Route to appropriate tool handler
  switch (name) {
    // Will add cases here
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
})

// Start server with stdio transport
const transport = new StdioServerTransport()
await server.connect(transport)
```

**Acceptance Criteria**:
- ✅ MCP server starts successfully
- ✅ Responds to tools/list request
- ✅ Can be spawned as child process from backend

**Estimated Time**: 3 hours

---

#### **Task 3.3: Integrate MCP Client in Backend**
**File**: `packages/backend/src/services/mcp-client.ts`

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { spawn } from 'child_process'

export class MCPClientManager {
  private clients = new Map<string, Client>()
  private processes = new Map<string, any>()

  async connectSupabase(accessToken: string): Promise<Client> {
    // Spawn Supabase MCP server
    const process = spawn('node', [
      './mcp-servers/supabase/dist/index.js'
    ], {
      env: {
        ...process.env,
        SUPABASE_ACCESS_TOKEN: accessToken,
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    // Create stdio transport
    const transport = new StdioClientTransport({
      reader: process.stdout,
      writer: process.stdin,
    })

    // Create and connect client
    const client = new Client(
      { name: 'chatflow-backend', version: '1.0.0' },
      { capabilities: {} }
    )

    await client.connect(transport)

    this.clients.set('supabase', client)
    this.processes.set('supabase', process)

    return client
  }

  async listTools(service: string): Promise<any[]> {
    const client = this.clients.get(service)
    if (!client) throw new Error(`Service ${service} not connected`)

    const response = await client.listTools()
    return response.tools
  }

  async callTool(service: string, toolName: string, args: any): Promise<any> {
    const client = this.clients.get(service)
    if (!client) throw new Error(`Service ${service} not connected`)

    return await client.callTool({ name: toolName, arguments: args })
  }

  async disconnect(service: string): Promise<void> {
    const client = this.clients.get(service)
    const process = this.processes.get(service)

    if (client) await client.close()
    if (process) process.kill()

    this.clients.delete(service)
    this.processes.delete(service)
  }
}
```

**Acceptance Criteria**:
- ✅ Backend can spawn Supabase MCP server
- ✅ Can list tools from MCP server
- ✅ Can call tools and get results
- ✅ Handles errors gracefully
- ✅ Can disconnect cleanly

**Estimated Time**: 5 hours

---

### **Phase 4: Core Supabase Operations (Days 7-10)**

#### **Task 4.1: Implement Project Listing**
**File**: `packages/mcp-servers/supabase/src/tools/projects.ts`

**Tool Definition**:
```typescript
{
  name: 'list_projects',
  description: 'List all Supabase projects user has access to',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
}
```

**Implementation**:
```typescript
async function listProjects(accessToken: string) {
  const response = await fetch('https://api.supabase.com/v1/projects', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  const projects = await response.json()

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(projects, null, 2),
    }],
  }
}
```

**Acceptance Criteria**:
- ✅ Tool registered in MCP server
- ✅ API call works
- ✅ Returns formatted list of projects
- ✅ AI can understand and present results

**Estimated Time**: 3 hours

---

#### **Task 4.2: Implement Project Creation**
**Tool**: `create_project`

**Input Schema**:
```typescript
{
  name: 'create_project',
  description: 'Create a new Supabase project',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Project name' },
      organization_id: { type: 'string', description: 'Organization ID' },
      db_pass: { type: 'string', description: 'Database password (min 8 chars)' },
      region: { type: 'string', description: 'Region (default: us-east-1)', default: 'us-east-1' },
    },
    required: ['name', 'organization_id', 'db_pass'],
  },
}
```

**Implementation**:
- POST to Supabase Management API
- Handle async project creation (may take 2-3 minutes)
- Return project details + credentials

**Acceptance Criteria**:
- ✅ Creates project successfully
- ✅ Returns project details
- ✅ Handles errors (name taken, invalid password, etc.)
- ✅ AI presents results clearly

**Estimated Time**: 4 hours

---

#### **Task 4.3: Implement Additional Project Operations**

**Tools to Implement**:

1. **`get_project_details`**
   - Get info about specific project
   - Time: 2 hours

2. **`get_api_keys`**
   - Retrieve anon and service role keys
   - Time: 2 hours

3. **`pause_project`** (Free tier only)
   - Pause inactive project
   - Time: 2 hours

4. **`restore_project`**
   - Restore paused project
   - Time: 2 hours

5. **`delete_project`**
   - Delete project (require confirmation)
   - Time: 2 hours

**Total Estimated Time**: 10 hours

---

#### **Task 4.4: Update Chat API to Use MCP**
**File**: `packages/backend/src/routes/chat.ts`

**Changes**:
1. Get user's active service context
2. Retrieve OAuth token for that service
3. Connect to appropriate MCP server
4. Get tools from MCP server
5. Pass tools to AI provider
6. Handle tool calls via MCP

**Acceptance Criteria**:
- ✅ Chat API aware of service context
- ✅ AI receives correct tools based on active service
- ✅ Tool calls routed to MCP server
- ✅ Results formatted and returned to user
- ✅ Errors handled gracefully

**Estimated Time**: 6 hours

---

#### **Task 4.5: AI Prompt Engineering for Supabase**
**File**: `packages/backend/src/prompts/supabase-system.ts`

**System Prompt**:
```
You are ChatFlow, an AI assistant helping users manage their Supabase projects.

Context:
- User is currently in Supabase context
- Available tools: [list of tools]
- User's organization: [org details]

Your role:
- Help users manage Supabase without opening the dashboard
- Ask clarifying questions when needed (organization, password, etc.)
- Confirm destructive actions (delete, drop)
- Provide clear, formatted responses
- Suggest next steps after operations

Guidelines:
- Be concise but informative
- Format API keys with copy buttons
- Warn about security (expose service keys, disable RLS)
- Present data in tables or lists for readability
- Always confirm before destructive operations

Example interactions:
User: "Create a project"
You: "I'll help you create a Supabase project. What should I name it?"

User: "blog-app"
You: "Great! Which organization?
     1. Personal (abc-123)
     2. My Startup (xyz-789)"

User: "Personal"
You: "Please set a database password (min 8 characters)"

[After creation]
You: "✓ Project created!

     📦 blog-app
     🌍 Region: us-east-1

     🔑 API Keys:
     Anon: eyJ... [Copy]
     Service: eyJ... [Copy]

     Next steps:
     - Set up database tables?
     - Configure authentication?
     - Create storage bucket?"
```

**Acceptance Criteria**:
- ✅ AI follows prompt guidelines
- ✅ Asks clarifying questions
- ✅ Formats responses nicely
- ✅ Suggests next steps
- ✅ Confirms destructive actions

**Estimated Time**: 3 hours

---

### **Phase 5: Testing & Polish (Days 9-10)**

#### **Task 5.1: End-to-End Testing**

**Test Scenarios**:

1. **Service Connection Flow**
   - [ ] Click "Connect Service"
   - [ ] OAuth flow completes successfully
   - [ ] Service appears in sidebar
   - [ ] Can switch to service context

2. **List Projects**
   - [ ] User: "Show me my projects"
   - [ ] AI calls list_projects tool
   - [ ] Results displayed clearly
   - [ ] Can handle "no projects" case

3. **Create Project**
   - [ ] User: "Create a project"
   - [ ] AI asks for name
   - [ ] AI asks for organization
   - [ ] AI asks for password
   - [ ] Project created
   - [ ] API keys returned (copyable)

4. **Get API Keys**
   - [ ] User: "Get API keys for blog-app"
   - [ ] Keys retrieved and displayed
   - [ ] Copy buttons work

5. **Delete Project**
   - [ ] User: "Delete test-project"
   - [ ] AI asks for confirmation
   - [ ] User confirms
   - [ ] Project deleted
   - [ ] Success message shown

6. **Error Handling**
   - [ ] Invalid password → Clear error message
   - [ ] Project name taken → Suggest alternative
   - [ ] OAuth token expired → Prompt to reconnect
   - [ ] API rate limit → Inform user, retry logic

**Estimated Time**: 6 hours

---

#### **Task 5.2: UI Polish**

**Improvements**:
- [ ] Loading states during OAuth
- [ ] Skeleton loaders for service list
- [ ] Smooth animations for service switching
- [ ] Error messages are user-friendly
- [ ] Success confirmations (toast notifications)
- [ ] Mobile responsive service selector

**Estimated Time**: 4 hours

---

#### **Task 5.3: Documentation**

**Create/Update**:
1. **User Guide**: How to connect Supabase
2. **API Documentation**: MCP server tools
3. **Development Guide**: How to add new tools
4. **Troubleshooting**: Common issues

**Estimated Time**: 3 hours

---

## 📊 Sprint Timeline

### **Week 1 (Days 1-5)**

**Day 1-2**: Service Selector UI
- Task 1.1: Update chat layout (4h)
- Task 1.2: ServiceSelector component (6h)
- Task 1.3: Service context management (4h)
- Task 1.4: Update messages with context (2h)

**Day 3-4**: OAuth Flow
- Task 2.1: Connection modal (6h)
- Task 2.2: Backend OAuth endpoints (8h)
- Task 2.3: OAuth configuration (6h)

**Day 5**: MCP Server Foundation
- Task 3.1: Project structure (2h)
- Task 3.2: MCP server scaffolding (3h)
- Task 3.3: Integrate MCP client (5h)

---

### **Week 2 (Days 6-10)**

**Day 6-8**: Supabase Operations
- Task 4.1: List projects (3h)
- Task 4.2: Create project (4h)
- Task 4.3: Additional operations (10h)
- Task 4.4: Update chat API (6h)
- Task 4.5: AI prompt engineering (3h)

**Day 9-10**: Testing & Polish
- Task 5.1: E2E testing (6h)
- Task 5.2: UI polish (4h)
- Task 5.3: Documentation (3h)

---

## ✅ Definition of Done

**Sprint 3 is complete when**:

### **Functional Requirements**
- ✅ User can connect Supabase via OAuth
- ✅ Service selector UI works (switch services)
- ✅ User can list Supabase projects via chat
- ✅ User can create Supabase project via chat (with AI conversation)
- ✅ User can get API keys via chat
- ✅ User can delete project via chat (with confirmation)
- ✅ All operations complete in <2 seconds
- ✅ Error messages are clear and actionable

### **Technical Requirements**
- ✅ OAuth flow secure (tokens encrypted)
- ✅ MCP server runs as isolated process
- ✅ MCP client can spawn/manage server
- ✅ Database schema updated (ServiceConnection model)
- ✅ All TypeScript compiles without errors
- ✅ No console errors in browser/backend

### **User Experience**
- ✅ Service selector is intuitive
- ✅ OAuth flow is smooth (no confusion)
- ✅ AI responses are clear and helpful
- ✅ Loading states everywhere
- ✅ Mobile responsive

### **Documentation**
- ✅ User guide for connecting services
- ✅ MCP server tools documented
- ✅ Code comments for complex logic

---

## 🚨 Risks & Mitigation

### **Risk 1: Supabase OAuth Not Available**
**Impact**: High
**Probability**: Medium
**Mitigation**:
- Research Supabase OAuth support early (Day 1)
- Implement fallback: Manual access token input
- Document both flows

### **Risk 2: MCP Server Complexity**
**Impact**: Medium
**Probability**: Low
**Mitigation**:
- Start simple (just project operations)
- Can refactor later if needed
- Test MCP server independently first

### **Risk 3: Supabase API Rate Limits**
**Impact**: Medium
**Probability**: Medium
**Mitigation**:
- Implement rate limit handling
- Show user when rate-limited
- Queue operations if needed

### **Risk 4: Project Creation Takes Time**
**Impact**: Low
**Probability**: High
**Mitigation**:
- Show "Creating... this may take 2-3 minutes" message
- Poll for status
- Send notification when done

---

## 📈 Success Metrics

**After Sprint 3, we should be able to say**:

1. ✅ "I connected my Supabase account in under 30 seconds"
2. ✅ "I created a Supabase project via chat faster than using the dashboard"
3. ✅ "I got my API keys without opening Supabase dashboard"
4. ✅ "The service selector makes it clear which service I'm talking to"
5. ✅ "I can switch between services easily"

**Metrics to Track**:
- OAuth success rate: >95%
- Average time to connect service: <30 seconds
- Average time to create project: <60 seconds (excluding Supabase's creation time)
- User satisfaction: "Was this faster than using the dashboard?" → Yes: >80%

---

## 🎯 What's Next: Sprint 4

**Sprint 4 Focus**: Supabase Database Management

**Goals**:
- Table operations (create, list, schema)
- Row-Level Security (RLS) policies
- Data querying (SQL via chat)
- Auth configuration basics

**Estimated Duration**: 2 weeks

---

## 📝 Notes

### **Dependencies**
- Supabase account for testing
- Supabase Management API access
- OAuth app registration (or access token)

### **Environment Setup**
```env
# Add to .env
SUPABASE_OAUTH_CLIENT_ID=xxx
SUPABASE_OAUTH_CLIENT_SECRET=xxx
SUPABASE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback/supabase

# Or fallback
SUPABASE_ACCESS_TOKEN=xxx  # For testing
```

### **Helpful Resources**
- Supabase Management API: https://supabase.com/docs/reference/api
- MCP SDK: https://modelcontextprotocol.io/
- OAuth 2.0 Flow: https://oauth.net/2/

---

**Let's build this! 🚀**
