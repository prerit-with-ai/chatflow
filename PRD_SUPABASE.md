# Product Requirements Document: Supabase Integration

**Version**: 1.0
**Date**: 2026-02-09
**Status**: Draft
**Owner**: Product Team

---

## 🎯 Objective

**Build a complete chat interface to Supabase that allows users to never open the Supabase dashboard again.**

**Success Criteria**:
- 80%+ of Supabase dashboard features accessible via chat
- Users report not opening dashboard for 2+ weeks
- Operations complete faster than via dashboard

---

## 👥 Target Users

### **Primary**
- **Solo developers** building on Supabase (side projects, MVPs)
- **Startup founders** managing Supabase projects
- **Small dev teams** (2-5 people) using Supabase

### **Use Cases**
1. Create new projects quickly
2. Manage database schema (tables, columns, RLS)
3. Query data for debugging
4. Check logs and monitor performance
5. Manage API keys and settings
6. Handle authentication configuration

---

## 🏗️ Technical Architecture

### **MCP Server Approach**

```
ChatFlow Backend (Node.js + Express)
    ↓ (spawns)
Supabase MCP Server (separate Node.js process)
    ↓ (uses)
Supabase Management API + Project-specific APIs
```

**Why MCP?**
- ✅ Isolated process (security)
- ✅ Can restart without affecting main app
- ✅ Scalable (add more services easily)
- ✅ Community can extend (standard protocol)

### **MCP Server Structure**

```
packages/mcp-servers/supabase/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/
│   │   ├── projects.ts       # Project management tools
│   │   ├── database.ts       # Database operations tools
│   │   ├── auth.ts           # Auth configuration tools
│   │   ├── storage.ts        # Storage management tools
│   │   ├── functions.ts      # Edge functions tools
│   │   └── settings.ts       # Settings & API keys tools
│   ├── api/
│   │   ├── management.ts     # Supabase Management API client
│   │   └── project.ts        # Project-specific API client
│   └── auth/
│       └── oauth.ts          # OAuth token management
├── package.json
└── tsconfig.json
```

---

## 🔐 Authentication & Authorization

### **OAuth Flow (Recommended)**

**Step 1: User Connects Supabase**
```
User clicks "Connect Supabase" in ChatFlow →
Redirected to Supabase OAuth screen →
User authorizes ChatFlow app →
Supabase redirects back with OAuth token →
ChatFlow stores token (encrypted)
```

**Step 2: Making API Calls**
```
User: "Create a project"
ChatFlow backend → Supabase MCP Server
MCP Server → Retrieves OAuth token → Calls Supabase Management API
Response → ChatFlow → User
```

**OAuth Scopes Needed**:
- `projects:read` - List and view projects
- `projects:write` - Create, update, delete projects
- `database:read` - Read database schema and data
- `database:write` - Modify database schema and data
- `auth:read` - View auth configuration
- `auth:write` - Modify auth configuration
- `storage:read` - View storage buckets and files
- `storage:write` - Manage storage

**Fallback: Access Token (If OAuth Not Available)**

If Supabase doesn't support OAuth apps (need to verify):
```
User provides:
- Supabase Access Token (from account settings)
We store: Encrypted in database with AES-256-GCM
```

---

## 📋 Feature Requirements

### **Phase 1: Core Project Management (Week 1-2)**

#### **1.1 Project Operations**

**Tools to Implement**:

1. **`list_projects`**
   - Description: List all Supabase projects user has access to
   - Parameters: None
   - Returns: Array of projects with basic info
   - Example: "Show me all my projects"

2. **`get_project_details`**
   - Description: Get detailed info about a specific project
   - Parameters: `project_ref` (string)
   - Returns: Full project details (region, status, plan, etc.)
   - Example: "Show me details for blog-app"

3. **`create_project`**
   - Description: Create a new Supabase project
   - Parameters:
     - `name` (string, required)
     - `organization_id` (string, required)
     - `db_pass` (string, required)
     - `region` (string, optional, default: "us-east-1")
     - `plan` (string, optional, default: "free")
   - Returns: Project details with credentials
   - Example: "Create a project called blog-app"

4. **`pause_project`**
   - Description: Pause a project (free tier)
   - Parameters: `project_ref` (string)
   - Example: "Pause my test-project"

5. **`restore_project`**
   - Description: Restore a paused project
   - Parameters: `project_ref` (string)
   - Example: "Restore test-project"

6. **`delete_project`**
   - Description: Delete a project (requires confirmation)
   - Parameters: `project_ref` (string), `confirm` (boolean)
   - Example: "Delete test-project" → "Are you sure?" → "Yes, delete it"

7. **`get_api_keys`**
   - Description: Get project API keys
   - Parameters: `project_ref` (string)
   - Returns: Anon key, service role key
   - Example: "Get API keys for blog-app"

8. **`regenerate_api_key`**
   - Description: Regenerate a specific API key
   - Parameters: `project_ref` (string), `key_type` (enum)
   - Example: "Regenerate anon key for blog-app"

---

### **Phase 2: Database Management (Week 3-4)**

#### **2.1 Schema Operations**

**Tools to Implement**:

1. **`list_tables`**
   - Description: List all tables in a project
   - Parameters: `project_ref` (string)
   - Example: "Show me all tables in blog-app"

2. **`get_table_schema`**
   - Description: Get schema for a specific table
   - Parameters: `project_ref` (string), `table_name` (string)
   - Returns: Columns, types, constraints
   - Example: "Show me schema for users table"

3. **`create_table`**
   - Description: Create a new table
   - Parameters:
     - `project_ref` (string)
     - `table_name` (string)
     - `columns` (array of column definitions)
     - `primary_key` (string, optional)
   - Example: "Create a posts table with title, content, author_id"

4. **`add_column`**
   - Description: Add column to existing table
   - Parameters:
     - `project_ref` (string)
     - `table_name` (string)
     - `column_name` (string)
     - `column_type` (string)
     - `nullable` (boolean)
     - `default_value` (any, optional)
   - Example: "Add a published_at timestamp column to posts table"

5. **`drop_column`**
   - Description: Remove column from table
   - Parameters: `project_ref`, `table_name`, `column_name`
   - Example: "Remove the old_field column from users"

6. **`drop_table`**
   - Description: Delete a table (requires confirmation)
   - Parameters: `project_ref`, `table_name`, `confirm`
   - Example: "Delete the temp_data table"

7. **`create_relationship`**
   - Description: Create foreign key relationship
   - Parameters: `project_ref`, `from_table`, `from_column`, `to_table`, `to_column`
   - Example: "Create relationship: posts.author_id → users.id"

#### **2.2 Row-Level Security (RLS)**

8. **`get_rls_policies`**
   - Description: List RLS policies for a table
   - Parameters: `project_ref`, `table_name`
   - Example: "Show RLS policies for users table"

9. **`create_rls_policy`**
   - Description: Create an RLS policy
   - Parameters:
     - `project_ref` (string)
     - `table_name` (string)
     - `policy_name` (string)
     - `command` (enum: SELECT, INSERT, UPDATE, DELETE)
     - `using_expression` (string, SQL expression)
   - Example: "Create RLS policy: users can only see their own data"

10. **`enable_rls`**
    - Description: Enable RLS on a table
    - Parameters: `project_ref`, `table_name`
    - Example: "Enable RLS on posts table"

11. **`disable_rls`**
    - Description: Disable RLS on a table
    - Parameters: `project_ref`, `table_name`
    - Example: "Disable RLS on posts table"

#### **2.3 Data Querying**

12. **`query_data`**
    - Description: Run a SQL query (SELECT only for safety)
    - Parameters: `project_ref`, `query` (string)
    - Returns: Query results
    - Example: "Show me the 10 most recent users"

13. **`count_rows`**
    - Description: Count rows in a table
    - Parameters: `project_ref`, `table_name`, `where_clause` (optional)
    - Example: "How many users do I have?"

14. **`insert_row`**
    - Description: Insert a single row
    - Parameters: `project_ref`, `table_name`, `data` (object)
    - Example: "Add a new user: email test@example.com, name Test User"

15. **`update_rows`**
    - Description: Update rows matching criteria
    - Parameters: `project_ref`, `table_name`, `where_clause`, `data`
    - Example: "Update user with id 123, set status to active"

16. **`delete_rows`**
    - Description: Delete rows (requires confirmation)
    - Parameters: `project_ref`, `table_name`, `where_clause`, `confirm`
    - Example: "Delete all test users"

---

### **Phase 3: Authentication Configuration (Week 5)**

#### **3.1 Auth Settings**

**Tools to Implement**:

1. **`get_auth_settings`**
   - Description: Get current auth configuration
   - Parameters: `project_ref`
   - Example: "Show me auth settings"

2. **`enable_email_auth`**
   - Description: Enable email/password authentication
   - Parameters: `project_ref`, `confirm_email` (boolean)
   - Example: "Enable email auth with confirmation"

3. **`configure_oauth_provider`**
   - Description: Set up OAuth provider (Google, GitHub, etc.)
   - Parameters: `project_ref`, `provider`, `client_id`, `client_secret`
   - Example: "Add Google OAuth with these credentials"

4. **`list_auth_users`**
   - Description: List authenticated users
   - Parameters: `project_ref`, `limit`, `offset`
   - Example: "Show me the first 20 users"

5. **`delete_auth_user`**
   - Description: Delete a user from auth system
   - Parameters: `project_ref`, `user_id`
   - Example: "Delete user with id xyz"

6. **`update_user_metadata`**
   - Description: Update user metadata
   - Parameters: `project_ref`, `user_id`, `metadata`
   - Example: "Update user xyz, set role to admin"

---

### **Phase 4: Storage Management (Week 6)**

#### **4.1 Storage Buckets**

**Tools to Implement**:

1. **`list_buckets`**
   - Description: List all storage buckets
   - Parameters: `project_ref`
   - Example: "Show me all storage buckets"

2. **`create_bucket`**
   - Description: Create a new storage bucket
   - Parameters: `project_ref`, `bucket_name`, `public` (boolean)
   - Example: "Create a public bucket called avatars"

3. **`delete_bucket`**
   - Description: Delete a bucket
   - Parameters: `project_ref`, `bucket_name`
   - Example: "Delete the temp-files bucket"

4. **`list_files`**
   - Description: List files in a bucket
   - Parameters: `project_ref`, `bucket_name`, `path` (optional)
   - Example: "Show files in avatars bucket"

5. **`get_file_url`**
   - Description: Get public URL for a file
   - Parameters: `project_ref`, `bucket_name`, `file_path`
   - Example: "Get URL for avatar.png in avatars bucket"

6. **`delete_file`**
   - Description: Delete a file from storage
   - Parameters: `project_ref`, `bucket_name`, `file_path`
   - Example: "Delete old-logo.png from assets bucket"

---

### **Phase 5: Edge Functions (Week 7)**

#### **5.1 Functions Management**

**Tools to Implement**:

1. **`list_functions`**
   - Description: List all edge functions
   - Parameters: `project_ref`
   - Example: "Show me all functions"

2. **`create_function`**
   - Description: Create a new edge function
   - Parameters: `project_ref`, `function_name`, `code`
   - Example: "Create a function called send-email"

3. **`deploy_function`**
   - Description: Deploy a function
   - Parameters: `project_ref`, `function_name`
   - Example: "Deploy the send-email function"

4. **`invoke_function`**
   - Description: Test invoke a function
   - Parameters: `project_ref`, `function_name`, `payload`
   - Example: "Test send-email function with this payload"

5. **`delete_function`**
   - Description: Delete a function
   - Parameters: `project_ref`, `function_name`
   - Example: "Delete the old-function"

---

### **Phase 6: Monitoring & Logs (Week 8)**

#### **6.1 Logs & Metrics**

**Tools to Implement**:

1. **`get_logs`**
   - Description: Fetch recent logs
   - Parameters:
     - `project_ref`
     - `type` (enum: api, database, auth, storage)
     - `limit` (optional, default: 50)
     - `since` (optional, timestamp)
   - Example: "Show me API logs from the last hour"

2. **`get_database_metrics`**
   - Description: Get database performance metrics
   - Parameters: `project_ref`
   - Returns: CPU, memory, connections, storage
   - Example: "What's my database CPU usage?"

3. **`get_api_metrics`**
   - Description: Get API usage metrics
   - Parameters: `project_ref`, `timeframe`
   - Returns: Request count, error rate, response times
   - Example: "Show me API metrics for the last 24 hours"

4. **`get_auth_metrics`**
   - Description: Get auth usage metrics
   - Parameters: `project_ref`
   - Returns: Active users, signups, login attempts
   - Example: "How many users signed up today?"

---

### **Phase 7: Settings & Billing (Week 9)**

#### **7.1 Project Settings**

**Tools to Implement**:

1. **`update_project_name`**
   - Description: Rename a project
   - Parameters: `project_ref`, `new_name`
   - Example: "Rename blog-app to my-blog"

2. **`get_project_settings`**
   - Description: Get all project settings
   - Parameters: `project_ref`
   - Example: "Show me settings for blog-app"

3. **`update_database_password`**
   - Description: Change database password
   - Parameters: `project_ref`, `new_password`
   - Example: "Change database password"

4. **`configure_custom_domain`**
   - Description: Set up custom domain
   - Parameters: `project_ref`, `domain`
   - Example: "Set up custom domain: api.myapp.com"

#### **7.2 Billing**

5. **`get_usage_stats`**
   - Description: Get current billing period usage
   - Parameters: `project_ref`
   - Returns: Database size, bandwidth, auth users, etc.
   - Example: "Show me my usage stats"

6. **`upgrade_plan`**
   - Description: Upgrade project plan
   - Parameters: `project_ref`, `plan` (enum: free, pro, team, enterprise)
   - Example: "Upgrade blog-app to Pro plan"

7. **`get_invoices`**
   - Description: List billing invoices
   - Parameters: `project_ref`
   - Example: "Show me my invoices"

---

## 🎨 User Experience

### **Chat Flow Examples**

#### **Example 1: Create a New Project**

```
User: "Create a new project"

ChatFlow: "What would you like to name it?"

User: "blog-app"

ChatFlow: "Which organization?
         1. Personal (personal-org-id)
         2. My Startup (startup-org-id)"

User: "Personal"

ChatFlow: "Set a database password (min 8 characters)"

User: "SecurePass123!"

ChatFlow: "Creating project... ⏳

✓ Project created!

📦 Project: blog-app
🌍 Region: us-east-1
📊 Plan: Free
🔗 URL: https://blog-app.supabase.co

🔑 API Keys:
   Anon key: eyJhbGc... [Copy]
   Service key: eyJhbGc... [Copy]

Would you like me to:
- Set up tables?
- Configure authentication?
- Create a storage bucket?"
```

#### **Example 2: Database Schema Management**

```
User: "Create a users table"

ChatFlow: "I'll create a users table. What columns should it have?

Suggestions:
- id (uuid, primary key)
- email (text, unique)
- created_at (timestamp)

Or describe your own structure."

User: "Those plus name and avatar_url"

ChatFlow: "Creating table... ⏳

✓ Table created!

📋 users table:
   - id (uuid, primary key)
   - email (text, unique, not null)
   - name (text)
   - avatar_url (text)
   - created_at (timestamp, default: now())

Would you like me to enable RLS on this table?"

User: "Yes"

ChatFlow: "✓ RLS enabled on users table

Default policy created: Users can read their own data

Want to add more policies?"
```

#### **Example 3: Querying Data**

```
User: "Show me the 10 most recent users"

ChatFlow: "Querying users table... ⏳

📊 Last 10 users:

1. john@example.com (John Doe) - 2 hours ago
2. jane@example.com (Jane Smith) - 5 hours ago
3. bob@example.com (Bob Johnson) - 1 day ago
...

Total users: 1,247

Want to:
- See more users?
- Filter by criteria?
- Export this data?"
```

#### **Example 4: Monitoring**

```
User: "Is everything running okay?"

ChatFlow: "Checking blog-app... ⏳

✅ Status: All systems operational

📊 Database:
   - CPU: 23% (normal)
   - Memory: 145 MB / 500 MB
   - Connections: 12 / 60
   - Storage: 2.3 GB / 8 GB

🌐 API:
   - Requests (24h): 12,453
   - Error rate: 0.02%
   - Avg response: 45ms

👥 Auth:
   - Active users: 234
   - Signups today: 12

Everything looks good! 👍"
```

---

## 🔄 AI Prompt Design

### **System Prompt for Supabase Context**

```
You are ChatFlow, an AI assistant helping users manage their Supabase projects.

Context:
- User is currently in Supabase service context
- Connected project: {project_ref} ({project_name})
- Available tools: [list of tools]

Your role:
- Help users manage Supabase without opening the dashboard
- Suggest best practices (RLS, indexing, etc.)
- Confirm destructive actions (delete, drop table)
- Provide clear, actionable responses
- Offer next steps after completing tasks

Guidelines:
- Be concise but informative
- Always confirm before destructive operations
- Suggest related actions
- Format data clearly (use markdown tables, lists)
- Include relevant links to docs when helpful

When user asks to create/modify:
1. Gather required information (ask follow-up questions)
2. Confirm details before executing
3. Execute and report success/failure
4. Suggest next steps

Safety:
- Always confirm before: delete, drop, truncate
- Never expose service role keys unless explicitly requested
- Warn about security implications (disabling RLS, etc.)
```

### **Example Tool Call Flow**

```typescript
// User: "Create a posts table"

// Step 1: AI gathers requirements
AI Response: "I'll create a posts table. What columns do you need?"

// Step 2: User provides details
User: "title, content, author_id, published_at"

// Step 3: AI confirms and calls tool
AI Calls: create_table({
  project_ref: "abc123",
  table_name: "posts",
  columns: [
    { name: "id", type: "uuid", primary_key: true, default: "gen_random_uuid()" },
    { name: "title", type: "text", nullable: false },
    { name: "content", type: "text" },
    { name: "author_id", type: "uuid", nullable: false },
    { name: "published_at", type: "timestamp" },
    { name: "created_at", type: "timestamp", default: "now()" }
  ]
})

// Step 4: Tool returns success
Tool Result: { success: true, table: { ... } }

// Step 5: AI formats response
AI Response: "✓ posts table created!

Columns:
- id (uuid, primary key)
- title (text, required)
- content (text)
- author_id (uuid, required)
- published_at (timestamp)
- created_at (timestamp)

Next steps:
- Create foreign key: author_id → users.id?
- Enable RLS on this table?
- Create an index on author_id?"
```

---

## 📊 Success Metrics

### **Feature Completeness**
- **Target**: 80% of Supabase dashboard features available via chat
- **Measure**: Checklist of dashboard features vs. chat capabilities

### **User Engagement**
- **Target**: Users interact with ChatFlow 5+ times per day
- **Measure**: Average daily operations per user

### **Dashboard Usage Reduction**
- **Target**: Users open Supabase dashboard <2 times per week
- **Measure**: User survey + analytics

### **Task Completion Time**
- **Target**: 50% faster task completion vs. dashboard
- **Measure**: Time studies (dashboard vs. chat)

### **User Satisfaction**
- **Target**: NPS score 60+
- **Measure**: In-app NPS survey

---

## 🚧 Technical Challenges

### **Challenge 1: OAuth Support**

**Issue**: Supabase may not have public OAuth for third-party apps

**Solutions**:
1. Partner with Supabase to add OAuth support
2. Use access tokens as fallback (user provides from settings)
3. Build custom OAuth flow with Supabase's approval

### **Challenge 2: Real-time Schema Changes**

**Issue**: Database schema operations require SQL, need to generate safe SQL

**Solutions**:
- Use Supabase's REST API where possible
- Generate SQL, show to user before executing
- Implement rollback capability for schema changes

### **Challenge 3: Complex Queries**

**Issue**: Users may ask for complex data queries in natural language

**Solutions**:
- AI generates SQL, shows to user before running
- Limit to SELECT queries for safety
- Implement query timeout (10 seconds max)
- Use Supabase's PostgREST API for common patterns

### **Challenge 4: Large Data Results**

**Issue**: Query might return thousands of rows

**Solutions**:
- Default limit: 100 rows
- Pagination support
- Offer to export large results to CSV
- Streaming results for large datasets

---

## 🔒 Security Considerations

### **1. OAuth Token Storage**
- Encrypt tokens at rest (AES-256-GCM)
- Store in database with user association
- Implement token refresh logic
- Allow user to revoke access

### **2. Query Validation**
- Only allow SELECT queries by default
- Confirm before UPDATE/DELETE
- Sanitize user input in queries
- Implement query parameter binding

### **3. Destructive Operations**
- Always confirm before:
  - Deleting projects
  - Dropping tables
  - Deleting buckets
  - Removing users
- Implement soft delete where possible
- Log all destructive operations

### **4. Rate Limiting**
- Respect Supabase API rate limits
- Implement exponential backoff
- Queue operations if needed
- Show user when rate-limited

---

## 📈 Rollout Plan

### **Week 1-2: Core Infrastructure**
- Set up MCP server structure
- Implement OAuth flow (or token-based auth)
- Build basic project operations (list, create, delete)
- Test with internal users

### **Week 3-4: Database Management**
- Implement schema operations
- Add RLS policy management
- Build query functionality
- Internal testing

### **Week 5-6: Additional Features**
- Auth configuration
- Storage management
- Edge functions support
- Internal testing

### **Week 7-8: Monitoring & Polish**
- Logs and metrics
- Settings and billing
- Error handling improvements
- UX refinements

### **Week 9: Alpha Launch**
- Private alpha with 50 users
- Gather feedback
- Iterate based on feedback
- Fix bugs

### **Week 10-12: Beta Launch**
- Public beta with 500 users
- Marketing push (Product Hunt, Hacker News)
- Partner with Supabase (cross-promotion)
- Prepare for production scale

---

## 🎯 Definition of Done

**The Supabase integration is complete when**:

1. ✅ User can perform 80% of dashboard tasks via chat
2. ✅ OAuth authentication works seamlessly
3. ✅ All 50+ tools implemented and tested
4. ✅ User testimonial: "Haven't opened Supabase dashboard in 2 weeks"
5. ✅ Response time <2 seconds for simple operations
6. ✅ Error messages are clear and actionable
7. ✅ Documentation complete (user guide + API docs)
8. ✅ 100+ alpha users actively using it
9. ✅ <1% error rate
10. ✅ NPS score 50+

---

## 📚 Resources

### **Supabase APIs**
- Management API: https://supabase.com/docs/reference/api/introduction
- Client Libraries: https://supabase.com/docs/reference/javascript/introduction
- REST API (PostgREST): https://supabase.com/docs/guides/api

### **MCP Protocol**
- Specification: https://modelcontextprotocol.io/
- SDK: @modelcontextprotocol/sdk

### **OAuth Documentation**
- Supabase OAuth: (TBD - need to verify if supported)
- Fallback: Access Token approach

---

## 🤝 Stakeholders

**Product Owner**: [Name]
**Tech Lead**: [Name]
**Designer**: [Name]
**QA**: [Name]

**External**:
- Supabase team (partnership)
- Alpha users (feedback)

---

## 📝 Open Questions

1. **Does Supabase support OAuth for third-party apps?**
   - Action: Contact Supabase team
   - Fallback: Access token approach

2. **Rate limits on Supabase Management API?**
   - Action: Test and document limits
   - Implement appropriate rate limiting

3. **How to handle project-specific credentials?**
   - Option A: Store OAuth tokens
   - Option B: User provides per-project tokens
   - Decision: TBD based on OAuth availability

4. **Real-time updates?**
   - Should chat show real-time metrics/logs?
   - Implementation: WebSocket or polling?

---

**This PRD is a living document. Update as we learn and iterate.** 🚀
