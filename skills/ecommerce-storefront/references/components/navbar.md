# Navbar Component

## Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Structure](#structure)
- [Mobile Considerations](#mobile-considerations)
- [Cart Visibility](#cart-visibility)
- [Accessibility](#accessibility)

## Overview

The navbar is the primary navigation element. It appears on every page and provides access to: logo, main navigation, search, cart, and account.

## Requirements

**ALWAYS include:**
- Logo (links to homepage)
- Main navigation links (desktop) / hamburger menu (mobile)
- Cart icon with item count badge
- Search input or icon
- Account icon/login link

**Must be:**
- Sticky (fixed at top)
- Visible at all times
- Responsive across all breakpoints

## Structure

```tsx
<header className="sticky top-0 z-50">
  <nav className="flex items-center justify-between px-4">
    {/* Logo */}
    <Link href="/">
      <img src="/logo.svg" alt="Store Name" />
    </Link>

    {/* Desktop Navigation */}
    <div className="hidden md:flex gap-6">
      <Link href="/products">Products</Link>
      <Link href="/categories">Categories</Link>
    </div>

    {/* Search, Cart, Account */}
    <div className="flex items-center gap-4">
      <SearchIcon />
      <Link href="/cart" className="relative">
        <CartIcon />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">
          {cartItemCount}
        </span>
      </Link>
      <AccountIcon />
    </div>
  </nav>
</header>
```

## Mobile Considerations

**CRITICAL**: Cart icon must ALWAYS be visible on mobile
- Never hide in hamburger menu
- Keep visible in header (top-right)
- Updates in real-time with cart count

## Cart Visibility

**Always visible:**
- Cart icon in header (not hamburger)
- Badge shows item count
- Uses `aria-live="polite"` for screen readers

```tsx
<Link href="/cart" aria-label={`Cart with ${count} items`}>
  <ShoppingCartIcon />
  {count > 0 && (
    <span aria-live="polite" className="...">
      {count}
    </span>
  )}
</Link>
```

## Accessibility

- Use semantic `<nav>` element
- Include `aria-label` for navigation
- Keyboard accessible menu items
- Focus indicators on all interactive elements

## Fetching Categories

NEVER hardcode categories - fetch from backend:

```typescript
const { data: categories } = useQuery(
  ['categories'],
  () => sdk.store.category.list()
)
```