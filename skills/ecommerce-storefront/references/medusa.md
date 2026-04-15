# Medusa Backend Integration

## Contents

- [Overview](#overview)
- [Installation](#installation)
- [SDK Setup](#sdk-setup)
- [Vite Configuration](#vite-configuration-tanstack-start-vite-projects)
- [TypeScript Types](#typescript-types)
- [Price Display](#price-display)
- [Critical Medusa Patterns](#critical-medusa-patterns)
- [Region State Management](#region-state-management)

## Overview

Guide for connecting your storefront to Medusa backend using the Medusa JS SDK.

**When to use this guide:**
- Building a storefront with Medusa backend
- Need to integrate Medusa SDK properly
- Working with multi-region stores

## Installation

```bash
npm install @medusajs/js-sdk@latest @medusajs/types@latest
```

Both required: SDK provides functionality, types provide TypeScript support.

## SDK Setup

```typescript
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

**CRITICAL: Always set publishableKey.**
- Required for multi-region stores to get correct pricing
- Required for accessing products with regional prices

**IMPORTANT: Storefront Port Configuration**
- Run storefront at port 8000 to avoid CORS errors
- Medusa backend expects storefront at `http://localhost:8000`

## Vite Configuration (TanStack Start, Vite Projects)

Add to your `vite.config.ts`:

```typescript
export default defineConfig({
  ssr: {
    noExternal: ['@medusajs/js-sdk'],
  },
})
```

## TypeScript Types

**IMPORTANT: Always use `@medusajs/types`**

```typescript
import type {
  StoreProduct,
  StoreCart,
  StoreRegion,
} from "@medusajs/types"
```

## Price Display

**CRITICAL: Medusa prices are stored as-is - DO NOT divide by 100.**

```typescript
// ❌ WRONG - Dividing by 100
<div>${product.variants[0].prices[0].amount / 100}</div>

// ✅ CORRECT - Display as-is
<div>${product.variants[0].prices[0].amount}</div>
```

**Correct price formatting:**
```typescript
const formatPrice = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}
```

## Critical Medusa Patterns

**IMPORTANT**: Always verify method names with documentation.

### 1. Always Pass `region_id` for Products

Product queries require `region_id` parameter for correct pricing.

### 2. Cart Updates Pattern

Line items have dedicated methods:
- Add item to cart
- Update item quantity
- Remove item from cart

### 3. Payment Flow Pattern

1. Query available payment providers
2. User selects payment method
3. Initialize payment session
4. Complete payment

### 4. Checkout Flow Pattern

1. Collect shipping address
2. Query available shipping options
3. User selects shipping method
4. Collect payment information
5. Complete/place order

## Region State Management

**Critical for Medusa**: Region determines currency, pricing, taxes.

### Implementation

1. Fetch available regions on app load
2. Detect user's country
3. Find region containing that country
4. Store selected region globally
5. Use `selectedRegion.id` for all cart and product operations

### When user changes country

1. Find new region containing the country
2. Update cart with new region_id
3. Store selection in localStorage

## Error Handling

SDK throws `FetchError` with status, statusText, and message.

```typescript
try {
  const data = await sdk.store.customer.retrieve()
} catch (error) {
  const fetchError = error as FetchError
  if (fetchError.statusText === "Unauthorized") {
    redirect('/login')
  }
}
```

## Resources

- **Medusa JS SDK docs**: https://docs.medusajs.com/resources/js-sdk
- **Storefront development**: https://docs.medusajs.com/resources/storefront-development
- **MCP Server**: https://docs.medusajs.com/mcp