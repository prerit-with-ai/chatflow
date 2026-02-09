# ChatFlow Design System

**Single Source of Truth for UI/UX**

## 📍 Quick Start

### To Change the Entire App's Look:

**Edit ONE file**: `packages/frontend/src/styles/theme.ts`

```typescript
// Change primary color from blue to green
colors: {
  primary: {
    600: '#059669',  // Change this
  }
}

// Change gradient
gradients: {
  primary: 'linear-gradient(to right, #059669, #10b981)',  // Change this
}
```

**That's it!** All components update automatically.

---

## 🎨 Design Tokens

### Colors

**File**: `src/styles/theme.ts`

```typescript
export const theme = {
  colors: {
    primary: { ... },    // Blue (brand)
    secondary: { ... },  // Purple
    accent: { ... },     // Pink
    neutral: { ... },    // Slate/Gray
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  }
}
```

**Usage in components**:
```tsx
// Tailwind classes (recommended)
<div className="bg-blue-600 text-white">

// CSS variables
<div style={{ background: 'var(--color-primary-600)' }}>

// TypeScript import
import { colors } from '@/styles/theme'
<div style={{ background: colors.primary[600] }}>
```

### Gradients

**Predefined gradients** in `theme.ts`:
- `primary`: Blue → Purple
- `secondary`: Purple → Pink
- `accent`: Orange → Red
- `hero`: Blue → Purple → Pink
- `background`: Subtle background gradient

**Usage**:
```tsx
// Tailwind
<div className="bg-gradient-to-r from-blue-600 to-purple-600">

// CSS variable
<div className="bg-gradient-primary">

// Inline
import { gradients } from '@/styles/theme'
<div style={{ background: gradients.primary }}>
```

### Spacing

**Scale**: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 (in rem)

**Usage**:
```tsx
// Tailwind
<div className="p-8 mb-4 gap-6">

// CSS variable
<div style={{ padding: 'var(--spacing-8)' }}>
```

### Typography

**Font sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl

**Usage**:
```tsx
<h1 className="text-5xl font-bold">
<p className="text-base">
```

### Shadows

**Levels**: sm, base, md, lg, xl, 2xl

**Usage**:
```tsx
<div className="shadow-lg">
<div className="shadow-2xl">
```

---

## 🔧 How to Rebrand (Before Launch)

### Step 1: Choose Your Colors

Pick your brand colors and update `theme.ts`:

```typescript
// Example: Change to green theme
colors: {
  primary: {
    500: '#10b981',  // Main green
    600: '#059669',  // Primary brand color
    700: '#047857',
  }
}
```

### Step 2: Update Gradients

```typescript
gradients: {
  primary: 'linear-gradient(to right, #059669, #10b981)',
  hero: 'linear-gradient(to right, #059669, #10b981, #06b6d4)',
}
```

### Step 3: Update CSS Variables

Run this command (or do it manually):
```bash
# Automatically sync theme.ts → design-system.css
npm run sync-theme
```

Or manually update `design-system.css` to match `theme.ts`.

### Step 4: Test

```bash
npm run dev
```

All components should reflect the new theme!

---

## 📦 File Structure

```
packages/frontend/src/
├── styles/
│   ├── theme.ts             ← EDIT THIS to change theme
│   └── design-system.css    ← CSS variables (auto-generated)
├── index.css                ← Imports design-system.css
└── components/
    └── *.tsx                ← Use theme tokens
```

---

## 🎯 Component Patterns

### Button (Primary CTA)

```tsx
// Using Tailwind (recommended)
<button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg">
  Get Started
</button>

// Using CSS classes
<button className="btn-primary">
  Get Started
</button>

// Using theme
import { gradients } from '@/styles/theme'
<button style={{ background: gradients.primary }}>
  Get Started
</button>
```

### Feature Card

```tsx
<div className="card group">
  <div className="icon-container-primary">
    <Icon />
  </div>
  <h3>Feature Title</h3>
  <p>Description</p>
</div>
```

### Gradient Text

```tsx
<h1 className="text-gradient-hero">
  Automate Your Workflows
</h1>
```

---

## 🚀 Quick Theme Examples

### Example 1: Dark Mode

```typescript
// theme.ts
colors: {
  primary: {
    600: '#60a5fa',  // Lighter blue for dark bg
  },
  neutral: {
    50: '#0f172a',   // Dark background
    900: '#f8fafc',  // Light text
  }
}
```

### Example 2: Warm Theme (Orange/Red)

```typescript
colors: {
  primary: {
    600: '#ea580c',  // Orange
  },
  secondary: {
    600: '#dc2626',  // Red
  }
}

gradients: {
  primary: 'linear-gradient(to right, #ea580c, #dc2626)',
  hero: 'linear-gradient(to right, #f97316, #ea580c, #dc2626)',
}
```

### Example 3: Professional (Navy/Teal)

```typescript
colors: {
  primary: {
    600: '#0f766e',  // Teal
  },
  secondary: {
    600: '#1e40af',  // Navy
  }
}

gradients: {
  primary: 'linear-gradient(to right, #1e40af, #0f766e)',
}
```

---

## 📖 Design Principles

### 1. Consistency
- Use spacing scale (multiples of 4px)
- Use defined colors (no arbitrary hex codes)
- Use shadow system (not custom shadows)

### 2. Scalability
- All tokens in `theme.ts`
- CSS variables for runtime changes
- Utility classes for common patterns

### 3. Maintainability
- One source of truth
- Document all changes
- Follow naming conventions

---

## 🔄 Migration Guide

### Before (Hardcoded)
```tsx
<div style={{ background: '#2563eb' }}>
```

### After (Design System)
```tsx
<div className="bg-blue-600">
// or
<div style={{ background: 'var(--color-primary-600)' }}>
// or
import { colors } from '@/styles/theme'
<div style={{ background: colors.primary[600] }}>
```

---

## ✅ Checklist Before Launch

- [ ] Review all colors in `theme.ts`
- [ ] Test theme on all pages
- [ ] Check mobile responsiveness
- [ ] Verify contrast ratios (accessibility)
- [ ] Update gradients if colors changed
- [ ] Test dark mode (if applicable)
- [ ] Document custom theme choices

---

## 🎨 Current Theme

**Brand Colors**:
- Primary: Blue (#2563eb)
- Secondary: Purple (#7c3aed)
- Accent: Pink (#ec4899)

**Gradients**:
- Primary: Blue → Purple
- Hero: Blue → Purple → Pink

**Typography**:
- Sans-serif system font stack
- Scale: xs (12px) to 7xl (72px)

**Spacing**:
- Base unit: 4px (0.25rem)
- Scale: 0 to 24 (0rem to 6rem)

---

## 📝 Notes

### Performance
- CSS variables have minimal performance impact
- Utility classes are purged in production (Tailwind)
- Theme object is tree-shakeable

### Browser Support
- CSS variables: All modern browsers
- Gradients: All modern browsers
- Fallbacks: Not needed (targeting modern browsers)

### Future Enhancements
- Theme switcher (light/dark mode)
- User-customizable themes
- A/B testing different color schemes
- Seasonal themes

---

**To change the entire design**: Edit `src/styles/theme.ts` and restart the dev server!
