# Directrices de Diseño

## Contents

- [Overview](#overview)
- [Discovering Existing Brand Identity](#discovering-existing-brand-identity)
- [Critical Consistency Rules](#critical-consistency-rules)
- [When to Ask User Approval](#when-to-ask-user-approval)
- [New Project Setup](#new-project-setup)
- [Decision Tree](#decision-tree)
- [Common Mistakes](#common-mistakes)

## Overview

**Purpose:** Provide guardrails to maintain brand consistency when building UI components. This prevents agents from accidentally introducing inconsistent colors, fonts, or design patterns.

**Critical principle:** ALWAYS discover and use existing design tokens before creating new components. NEVER introduce new colors or fonts without user approval.

**When to apply:** Before creating any UI component or design-related change.

## Discovering Existing Brand Identity

Before implementing any component, identify existing brand colors, typography, and design patterns.

### What to Look For

**Colors:**
1. **Tailwind config** (`tailwind.config.ts/js`) - Check `theme.extend.colors` or `theme.colors`
2. **CSS variables** (globals.css, app.css) - Look for `:root { --color-primary: ... }`
3. **Existing components** - Scan 2-3 components for color usage patterns

**Typography:**
1. **Tailwind config** - Check `theme.extend.fontFamily`
2. **Font imports** - Look in layout files or CSS (Next.js `next/font`, Google Fonts, local fonts)
3. **CSS variables** - Check for `--font-sans`, `--font-heading`

### Detecting Tailwind Version (CRITICAL)

**ALWAYS check the Tailwind CSS version before writing utility classes.**

**How to detect version:**
1. **Check `package.json`**: Look for `"tailwindcss": "^3.x.x"` or `"tailwindcss": "^4.x.x"`
2. **Check config file**:
   - v3: Uses `tailwind.config.js/ts` with `module.exports`
   - v4: May use CSS-based config with `@import "tailwindcss"`

## Critical Consistency Rules

### ALWAYS Follow These Rules

✅ **NEVER use emojis in storefront UI** - Always use icons or images instead

✅ **USE existing design tokens** (colors, fonts, spacing from theme)

✅ **USE existing font definitions**, not new font families

✅ **MATCH patterns from existing components**

### NEVER Do These Things

❌ **DON'T introduce new colors without user approval**
❌ **DON'T add new fonts without user approval**
❌ **DON'T use hard-coded values when theme tokens exist**
❌ **DON'T create inconsistent patterns**

## When to Ask User Approval

**ALWAYS ask before:**

### 1. Adding New Color
```
"I notice the current palette doesn't include an orange accent color.
Should I add one, or would you prefer to use the existing accent color?"
```

### 2. Adding New Font
```
"The current design uses Inter for all text. Do you want me to add
a different font for headings, or keep using Inter throughout?"
```

### 3. Changing Existing Definitions
```
"Should I update the primary color to #3B82F6, or create a
new color variant?"
```

## New Project Setup

When starting a new project WITHOUT existing theme:

### Ask User These Questions

**1. Brand Colors:**
```
"What are your brand colors? Please provide:
- Primary color (main brand color)
- Secondary color (optional)
- Any specific hex codes or color preferences?"
```

**2. Font Preferences:**
```
"Do you have font preferences?
- Modern and clean (Inter, Poppins)
- Classic and professional (Merriweather, Lora)
- Specific fonts?"
```

**3. Design Style:**
```
"What design style do you prefer?
- Minimal (lots of whitespace, clean lines)
- Bold (vibrant colors, large typography)
- Professional (conservative, trust-focused)
- Modern (rounded corners, gradients, shadows)"
```

### Setup Theme Configuration

After gathering preferences, configure Tailwind theme:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
}
```

## Decision Tree

**When creating any component:**

```
1. Does a theme configuration exist?
   ├─ Yes → Extract colors/fonts from theme
   └─ No → Ask user for brand preferences

2. Are there similar existing components?
   ├─ Yes → Follow their patterns exactly
   └─ No → Check existing components for guidance

3. Do you need a color/font not in theme?
   ├─ Yes → ASK user for approval
   └─ No → Proceed with existing tokens
```

## Common Mistakes

### ❌ Using Arbitrary Values When Theme Exists
**Problem:** Using `bg-[#3B82F6]` when `bg-primary` exists.

### ❌ Introducing New Colors Without Permission
**Problem:** Adding `text-orange-500` when theme doesn't have orange.

### ❌ Not Checking Existing Patterns
**Problem:** Creating buttons with `rounded-full` when all other buttons use `rounded-lg`.

### ❌ Adding Fonts Without Permission
**Problem:** Using `font-['Montserrat']` when theme uses Inter everywhere.

### ❌ Mixing Tailwind v3 and v4 Syntax
**Problem:** Using Tailwind v3 syntax in a v4 project, or vice versa.

## Summary Checklist

**Before creating any component:**
- [ ] Detected Tailwind CSS version (v3 or v4)
- [ ] Checked for existing theme configuration
- [ ] Extracted existing colors
- [ ] Extracted existing fonts
- [ ] Reviewed 2-3 existing components for patterns
- [ ] Maintained visual consistency