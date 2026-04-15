# Connecting to Backend

## Contents

- [Overview](#overview)
- [Detecting the Backend](#detecting-the-backend-critical)
- [Framework Detection](#framework-detection)
- [Environment Configuration](#environment-configuration)
- [Backend-Specific Integration](#backend-specific-integration)
- [Authentication Patterns](#authentication-patterns)
- [Cart State Management](#cart-state-management)
- [Error Handling for Ecommerce](#error-handling-for-ecommerce)
- [Performance Patterns](#performance-patterns)

## Overview

Best practices for connecting storefront to ecommerce backend APIs. Framework-agnostic patterns for authentication, cart state management, error handling, and performance optimization.

**For Medusa-specific integration**, see `medusa.md` for SDK setup, pricing, regions, and Medusa patterns.

## Detecting the Backend (CRITICAL)

**Before implementing any backend integration, identify which ecommerce backend is being used.**

### Detection Strategy

**1. Check for monorepo structure:**
```bash
ls -la ../backend
ls -la ./backend
ls -la ../../apps/backend
```

Common monorepo patterns:
- `/apps/storefront` + `/apps/backend`
- `/frontend` + `/backend`
- `/packages/web` + `/packages/api`

**2. Check package.json dependencies:**
```json
{
  "dependencies": {
    "@medusajs/js-sdk": "..."
  }
}
```

**3. Check environment variables:**
```bash
grep -i "api|backend|medusa|commerce" .env*
```

**4. If unsure, ASK THE USER:**

```
I need to connect to the ecommerce backend. Which backend are you using?
Options:
- Medusa (open-source headless commerce)
- Custom backend
- Shopify
- Other
```

## Framework Detection

Identify the frontend framework to determine appropriate data fetching patterns:

**Next.js:**
- App Router: Server Components (async/await), Client Components (useEffect/TanStack Query)
- Pages Router: getServerSideProps/getStaticProps

**SvelteKit:**
- Load functions for server-side data

**TanStack Start:**
- Server functions for server-side data

## Environment Configuration

**Store API URLs and keys in environment variables:**

```typescript
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_PUBLISHABLE_KEY=pk_...
```

**Framework-specific prefixes:**
- Next.js: `NEXT_PUBLIC_` for client-side
- SvelteKit: `PUBLIC_` for client-side

## Backend-Specific Integration

### Medusa Backend

**For complete Medusa integration guide**, see `medusa.md` which covers:
- SDK installation and setup
- TypeScript types from `@medusajs/types`
- Price display (never divide by 100)
- Common operations

### Other Backends

For non-Medusa backends:
1. Consult backend's API documentation
2. Use backend's official SDK if available
3. If no SDK, create API client wrapper

## Authentication Patterns

### Customer Authentication

**Session-based (cookies):**
- Backend manages session via cookies

**Token-based (JWT):**
- Store token in localStorage after login
- Include token in Authorization header

### Cart Access Pattern

**Guest carts:**
- Store cart ID in localStorage or cookie
- Check for existing cart ID on app load
- Create new cart if none exists

**Logged-in carts:**
- Associate cart with customer account
- **CRITICAL: Merge guest cart with customer cart on login**

## Cart State Management

**Critical ecommerce pattern**: Cart must be accessible throughout the app.

### Global Cart State

**React Context:**
- Create CartContext and CartProvider
- Store cart state and cartId
- Provide methods: addItem, removeItem, updateQuantity, clearCart

**State management libraries (Zustand, Redux):**
- Use for complex state requirements

### Cart Cleanup After Order Placement (CRITICAL)

**IMPORTANT: After order is successfully placed, you MUST reset the cart state.**

**Required cleanup actions:**
1. Clear cart from global state
2. Clear localStorage cart ID
3. Update cart count to 0

## Error Handling for Ecommerce

### Ecommerce-Specific Errors

**Out of stock:**
- Show: "Sorry, this item is now out of stock"

**Payment failed:**
- Show specific messages for payment failures

**Session expired:**
- Redirect to login with message

### User-Friendly Error Messages

Transform technical errors to clear messages:
- Network errors → "Unable to connect. Please check your internet connection."
- Generic fallback → "Something went wrong. Please try again."

## Performance Patterns

### Data Fetching with TanStack Query (RECOMMENDED)

**Use TanStack Query for all backend API calls**

**Installation:** `npm install @tanstack/react-query`

## Checklist

- [ ] Backend detected (Medusa, custom, etc.)
- [ ] Environment variables configured
- [ ] TanStack Query installed
- [ ] Server-side fetching for product pages (SEO)
- [ ] Client-side fetching for cart
- [ ] Authentication flow implemented
- [ ] Cart ID persisted in localStorage
- [ ] Global cart state management
- [ ] Error handling for out of stock
- [ ] Error handling for payment failures
- [ ] User-friendly error messages
- [ ] Cart cleared after order placement