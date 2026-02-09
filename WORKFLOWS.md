# Reusable Workflows & Patterns

**Purpose**: Document best practices, patterns, and learnings from ChatFlow that can be applied to future projects.

**Last Updated**: 2026-02-09

---

## 🎯 Development Methodology

### ✅ User-Journey-First Approach

**What it is**: Build features as thin vertical slices that deliver complete user journeys, not horizontal layers.

**Why it works**:
- Get feedback early and often
- Always have something demonstrable
- Avoid over-engineering
- Natural prioritization (most important journeys first)

**Example from ChatFlow**:
- Sprint 1: Foundation → Landing Page (not "build entire backend first")
- Sprint 2: Landing Page → Chat (not "build all frontend components")
- Each sprint delivers a complete, working experience

**Apply to future projects**:
```
❌ Bad: "Build all database models → Build all API endpoints → Build all UI"
✅ Good: "User can sign up and see welcome page → User can create first item → User can edit item"
```

---

## 🏗️ Architecture Patterns

### ✅ Multi-Provider Architecture (Interface + Factory)

**Pattern**: Abstract third-party services behind interfaces, use factory pattern for selection.

**Benefits**:
- Easy to switch providers
- Test with mock implementations
- Add new providers without changing consumer code
- Avoid vendor lock-in

**Implementation**:

```typescript
// 1. Define interface
export interface AIProvider {
  readonly name: string
  sendMessage(message: string, history?: any[], tools?: any[]): Promise<AIResponse>
  continueWithToolResult(history: any[], results: any[], tools?: any[]): Promise<AIResponse>
  validateConfig(): void
}

// 2. Implement for each provider
export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic'
  // ... implementation
}

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai'
  // ... implementation
}

// 3. Factory for runtime selection
export function createAIProvider(providerType?: string): AIProvider {
  const provider = (providerType || process.env.AI_PROVIDER || 'default').toLowerCase()
  switch (provider) {
    case 'anthropic': return new AnthropicProvider()
    case 'openai': return new OpenAIProvider()
    default: throw new Error(`Unknown provider: ${provider}`)
  }
}

// 4. Lazy initialization to avoid startup errors
let aiProvider: AIProvider | null = null

function getAIProvider(): AIProvider {
  if (!aiProvider) {
    aiProvider = createAIProvider()
  }
  return aiProvider
}
```

**Apply to future projects**:
- Payment providers (Stripe, PayPal, Square)
- Email services (SendGrid, Mailgun, SES)
- Storage providers (AWS S3, Google Cloud Storage, Azure Blob)
- Analytics providers (Google Analytics, Mixpanel, Amplitude)

**Key Lesson**: Don't tightly couple to specific vendors. Always abstract.

---

## 🎨 Design System Pattern

### ✅ Centralized Theme System

**Pattern**: Single source of truth for all design tokens (colors, spacing, typography, etc.)

**Benefits**:
- Rebrand entire app by editing one file
- Consistent design throughout
- Easy to maintain
- Design tokens can be synced to CSS variables

**Implementation**:

```typescript
// packages/frontend/src/styles/theme.ts
export const theme = {
  colors: {
    primary: {
      600: '#2563eb',  // Change this to rebrand
    }
  },
  gradients: {
    primary: 'linear-gradient(to right, #2563eb, #7c3aed)',
  },
  spacing: {
    8: '2rem',
  },
  // ... all design tokens
} as const

export const { colors, gradients, spacing } = theme
```

```css
/* packages/frontend/src/styles/design-system.css */
:root {
  --color-primary-600: #2563eb;
  --gradient-primary: linear-gradient(to right, #2563eb, #7c3aed);
  --spacing-8: 2rem;
}

.bg-gradient-primary {
  background: var(--gradient-primary);
}
```

**Usage in components**:
```tsx
// Option 1: Tailwind classes (recommended)
<div className="bg-blue-600 text-white">

// Option 2: CSS variables
<div style={{ background: 'var(--color-primary-600)' }}>

// Option 3: TypeScript import
import { colors } from '@/styles/theme'
<div style={{ background: colors.primary[600] }}>
```

**Apply to future projects**:
- Always create theme.ts/design-system.css at project start
- Document how to rebrand (DESIGN_SYSTEM.md)
- Use design tokens, never hardcode colors/spacing
- Consider dark mode from the start

**Key Lesson**: Design systems save massive time during UI changes. Set up early.

---

## 📁 Project Structure

### ✅ Monorepo with Clear Separation

**Pattern**: Use npm workspaces for related packages with clear boundaries.

```
project-root/
├── packages/
│   ├── frontend/        # React/Vue/etc.
│   ├── backend/         # Node.js/Express/etc.
│   └── shared/          # Shared types, utils
├── CLAUDE.md            # Project context (see below)
├── CONTEXT.md           # Session progress tracker
├── DESIGN_SYSTEM.md     # Design system guide
├── WORKFLOWS.md         # This file
└── package.json         # Workspace root
```

**Benefits**:
- Code sharing between packages
- Independent versioning
- Clear boundaries
- Easier to understand

**Apply to future projects**:
- Start with monorepo if you have multiple related packages
- Use shared package for types/utilities
- Keep clear boundaries (frontend ≠ backend concerns)

---

## 📝 Documentation Strategy

### ✅ Living Documentation Files

**Pattern**: Maintain context files that evolve with the project.

**Files to create**:

1. **CLAUDE.md** - Project context for AI assistants
   - Architecture overview
   - Key decisions and why
   - Conventions and patterns
   - How things work
   - Updated as architecture evolves

2. **CONTEXT.md** - Session progress tracker
   - What's been built
   - Current status
   - Next steps
   - Updated at end of each session

3. **DESIGN_SYSTEM.md** - Design system guide
   - How to use theme
   - How to rebrand
   - Component patterns
   - Updated when design tokens change

4. **WORKFLOWS.md** (this file) - Reusable patterns
   - Best practices learned
   - Patterns to reuse
   - Anti-patterns to avoid
   - Updated when discovering new patterns

5. **SPRINT_X_COMPLETE.md** - Sprint summaries
   - What was built
   - Statistics
   - Test checklist
   - Created at sprint completion

**Benefits**:
- Context persists across sessions
- Easy onboarding for new developers
- AI assistants stay aligned
- Documents decisions for future reference

**Key Lesson**: Documentation that lives with code is more likely to stay updated.

---

## 🔧 TypeScript Best Practices

### ✅ Patterns from ChatFlow

**1. Use `as const` for theme objects**:
```typescript
export const theme = {
  colors: { primary: { 600: '#2563eb' } }
} as const  // Makes deeply readonly
```

**2. Extract shared types**:
```typescript
// packages/backend/src/types/ai-provider.ts
export interface AIProvider {
  // Shared interface
}

export interface AIResponse {
  // Shared response type
}
```

**3. Prefer interfaces over types for contracts**:
```typescript
// ✅ Good: Interface for contracts
export interface AIProvider {
  sendMessage(...): Promise<AIResponse>
}

// ❌ Avoid: Type for contracts
export type AIProvider = {
  sendMessage(...): Promise<AIResponse>
}
```

**4. Use type guards when needed**:
```typescript
if (toolCall.type === 'function') {
  // TypeScript now knows toolCall is FunctionToolCall
  return toolCall.function.name
}
```

**5. Lazy initialization for error-prone services**:
```typescript
let provider: AIProvider | null = null

function getProvider(): AIProvider {
  if (!provider) {
    provider = createProvider()
  }
  return provider
}
```

---

## 🚨 Anti-Patterns to Avoid

### ❌ Hardcoded Values

**Bad**:
```typescript
<div style={{ background: '#2563eb' }}>
<div style={{ padding: '2rem' }}>
```

**Good**:
```typescript
<div className="bg-blue-600">
<div className="p-8">
// or
<div style={{ background: 'var(--color-primary-600)' }}>
```

**Lesson**: Never hardcode design values. Always use design tokens.

---

### ❌ Provider Initialization at Module Load

**Bad**:
```typescript
// Fails at startup if API key missing
const aiProvider = createAIProvider()

export async function handleChat(req, res) {
  const response = await aiProvider.sendMessage(...)
}
```

**Good**:
```typescript
// Lazy initialization
let aiProvider: AIProvider | null = null

function getAIProvider(): AIProvider {
  if (!aiProvider) {
    aiProvider = createAIProvider()
  }
  return aiProvider
}

export async function handleChat(req, res) {
  const provider = getAIProvider()
  const response = await provider.sendMessage(...)
}
```

**Lesson**: Defer expensive/error-prone initialization until actually needed.

---

### ❌ Tight Coupling to Vendors

**Bad**:
```typescript
import Anthropic from '@anthropic-ai/sdk'

export async function chat(message: string) {
  const anthropic = new Anthropic()
  return await anthropic.messages.create({...})
}
```

**Good**:
```typescript
import { AIProvider } from './types/ai-provider'
import { createAIProvider } from './providers'

export async function chat(message: string) {
  const provider: AIProvider = createAIProvider()
  return await provider.sendMessage(message)
}
```

**Lesson**: Abstract third-party services. Makes switching vendors trivial.

---

### ❌ Building Horizontal Layers First

**Bad Approach**:
1. Build entire database schema
2. Build all API endpoints
3. Build all frontend components
4. Wire everything together

**Problems**:
- Can't test user journeys until the end
- Over-engineering (building features you don't need)
- No feedback loop
- High risk (what if core assumption is wrong?)

**Good Approach** (Vertical Slices):
1. User can sign up and see welcome page (thin slice end-to-end)
2. User can create their first item (another thin slice)
3. User can edit an item (another thin slice)

**Benefits**:
- Always have working software
- Get feedback early
- Natural prioritization
- Lower risk

---

## 🎓 Key Learnings

### 1. Multi-Provider from Day 1

**Lesson**: If you're integrating with any third-party service (AI, payments, email), abstract it from the start. It's much harder to refactor later.

**From ChatFlow**: Started with Anthropic-only, refactored to multi-provider. Would have been easier to start with abstraction.

---

### 2. Design System Upfront

**Lesson**: Set up centralized theme/design tokens at project start, not later.

**From ChatFlow**: Added design system in Sprint 2. Should have been in Sprint 0 (Foundation).

---

### 3. Documentation as Code

**Lesson**: Keep documentation files in the repo, update them as you code.

**From ChatFlow**: CLAUDE.md, CONTEXT.md, DESIGN_SYSTEM.md saved massive context across sessions.

---

### 4. Port Conflicts Are Common

**Lesson**: Don't hardcode ports. Use environment variables. Check what's running on common ports (3000, 5173, etc.).

**From ChatFlow**: Had to change backend port twice (3000→3001→3002).

**Solution**:
```typescript
const PORT = process.env.PORT || 3002
```

---

### 5. Lazy Initialization for External Services

**Lesson**: Don't initialize external services (that require API keys, network calls, etc.) at module load. Initialize lazily when first needed.

**From ChatFlow**: Provider initialization at startup caused errors when API keys missing. Fixed with lazy pattern.

---

## 📋 Project Startup Checklist

Use this for future projects:

### Initial Setup
- [ ] Create monorepo structure (packages/frontend, packages/backend, packages/shared)
- [ ] Set up TypeScript with strict mode
- [ ] Create .gitignore (node_modules, .env, build outputs)
- [ ] Initialize git repository

### Documentation
- [ ] Create CLAUDE.md (architecture, decisions, conventions)
- [ ] Create CONTEXT.md (session tracker)
- [ ] Create DESIGN_SYSTEM.md (if applicable)
- [ ] Create WORKFLOWS.md (reusable patterns)
- [ ] Create README.md (quick start, overview)

### Design System
- [ ] Create theme.ts with design tokens
- [ ] Create design-system.css with CSS variables
- [ ] Document how to rebrand
- [ ] Use design tokens everywhere (no hardcoded values)

### Architecture
- [ ] Identify third-party services (AI, payments, email, etc.)
- [ ] Create abstraction interfaces for each service
- [ ] Implement factory pattern for service selection
- [ ] Use lazy initialization for external services
- [ ] Use environment variables for configuration

### Development Approach
- [ ] Plan vertical slices (complete user journeys)
- [ ] Prioritize slices by user value
- [ ] Build thin end-to-end before going wide
- [ ] Get feedback after each slice

---

## 🔄 When to Apply These Patterns

### Multi-Provider Architecture
**Use when**: Integrating with any third-party service that has alternatives
**Examples**: AI providers, payment gateways, email services, storage providers
**Skip when**: Using a service with no realistic alternatives (e.g., Stripe for many use cases)

### Centralized Design System
**Use when**: Building any UI (web, mobile, desktop)
**Skip when**: Prototype/throwaway code

### Vertical Slice Development
**Use when**: Building any product with users
**Skip when**: Building libraries/tools (different development model)

### Living Documentation
**Use when**: Working with AI assistants or multi-session projects
**Use when**: Team projects (onboarding new developers)
**Skip when**: One-off scripts or small utilities

---

## 🎯 Summary

**Top 5 Patterns to Reuse**:
1. **Multi-provider architecture** (interface + factory)
2. **Centralized design system** (theme.ts + CSS variables)
3. **User-journey-first development** (vertical slices)
4. **Living documentation** (CLAUDE.md, CONTEXT.md, etc.)
5. **Lazy initialization** (for external services)

**Top 5 Anti-Patterns to Avoid**:
1. ❌ Hardcoded design values (colors, spacing, etc.)
2. ❌ Tight coupling to vendors
3. ❌ Building horizontal layers first
4. ❌ Provider initialization at module load
5. ❌ No documentation (context gets lost)

---

**Next Project Strategy**:
1. Start with project structure (monorepo if applicable)
2. Create documentation files (CLAUDE.md, CONTEXT.md)
3. Set up design system (theme.ts, design-system.css)
4. Identify third-party services and abstract them
5. Plan vertical slices (user journeys)
6. Build incrementally, getting feedback after each slice
7. Update documentation as you go

---

**Questions for Each New Project**:
- What third-party services will I use? (Abstract them)
- What are the core user journeys? (Plan vertical slices)
- What design tokens do I need? (Set up design system early)
- How will I maintain context? (Create documentation files)

---

**Remember**: These patterns emerged from building ChatFlow. As you build more projects, add new learnings to this file. Make it a living document.
