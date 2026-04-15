# Mobile Responsiveness for Ecommerce Storefronts

## Contents

- [Overview](#overview)
- [Mobile Ecommerce Patterns](#mobile-ecommerce-patterns)
- [Touch-Friendly Interactions](#touch-friendly-interactions)
- [Mobile Performance](#mobile-performance)
- [Safe Area Insets (iOS)](#safe-area-insets-ios)
- [Common Mobile Mistakes](#common-mobile-mistakes)

## Overview

Over 60% of ecommerce traffic is mobile. Mobile-first design is essential for conversion.

### Key Requirements

- Mobile-first CSS (min-width media queries)
- 44x44px minimum touch targets
- Sticky header with cart access
- Large form inputs (48px height minimum)
- Optimized images for mobile
- Fast loading (LCP < 2.5s)

## Mobile Ecommerce Patterns

### Sticky Elements (Critical for Conversion)

**Cart access always visible:**
- Sticky header with cart icon (top-right)
- Or: Sticky bottom navigation with cart
- Never hide cart in hamburger drawer
- Shows count badge, updates in real-time

**Sticky "Add to Cart" bar (product pages):**
- Fixed at bottom of screen
- Shows: Price + "Add to Cart" button
- Appears after scrolling past fold
- Always accessible without scrolling
- **CRITICAL: Must use `env(safe-area-inset-bottom)` for iOS devices**

### Mobile Navigation Patterns

**Bottom navigation (optional pattern):**
- Consider for mobile-heavy stores (>70% mobile traffic)
- 4-5 primary actions: Home, Categories, Cart, Account, Search
- Fixed at bottom (easier thumb access)
- Icons + labels for clarity

**When to use:**
- Mobile-first brands (fashion, beauty)
- Younger demographic (18-34)

**When NOT to use:**
- Desktop-heavy traffic
- Complex navigation needs

### Mobile Product Browsing

**Image galleries:**
- Full-width swipeable carousel
- Pinch to zoom
- Dot indicators (1/5, 2/5)

**Filter drawer:**
- "Filters" button with badge count
- Slide-out drawer
- "Apply" button at bottom

### Mobile Checkout Optimization

**Digital wallets priority (CRITICAL for mobile conversion):**
- Apple Pay / Google Pay buttons prominent at top
- One-click payment with pre-filled shipping addresses
- Consider making digital wallet the default on mobile

**Form optimizations:**
- Single-column layout
- 44-48px input height minimum
- Proper keyboard types (`inputMode="email"`, `"numeric"`, `"tel"`)
- Autocomplete attributes

## Touch-Friendly Interactions

**Standard touch targets:** 44x44px minimum for all interactive elements:
- Filter checkboxes on product listings
- Quantity +/- buttons
- Small action buttons on product cards
- Modal close buttons

**Swipe gestures:**
- Product image galleries
- Related product sliders

## Mobile Performance

**Ecommerce performance priorities:**

1. **Product images**: Optimize for mobile (<500KB), lazy load below-fold
2. **Optimistic UI**: Cart count updates immediately
3. **Skeleton screens**: Show loading placeholders

**Critical mobile performance issues:**
- Unoptimized product images (>1MB)
- Loading entire product catalog at once

## Safe Area Insets (iOS)

Use `env(safe-area-inset-*)` to handle iOS notches:
- Sticky headers (top inset)
- Sticky bottom navigation or add-to-cart bars (bottom inset)

**Critical for ecommerce**: Bottom "Add to Cart" bars will be cut off by iOS home indicator (~34px).

## Common Mobile Mistakes

1. **Hiding cart in drawer** - Cart icon hidden in hamburger menu
2. **No sticky cart access** - Cart scrolls off screen
3. **Desktop-sized images** - Serving 2MB+ images to mobile
4. **Poor form experience** - Small inputs, wrong keyboards
5. **Hover-only interactions** - Quick view doesn't work on tap
6. **Ignoring safe area insets** - Bottom elements cut off
7. **No digital wallet options** - Missing Apple Pay/Google Pay

## Mobile Checklist

- [ ] Mobile-first CSS (min-width media queries)
- [ ] 44x44px minimum touch targets
- [ ] Sticky header with cart icon (always visible)
- [ ] Sticky bottom "Add to Cart" bar on product pages
- [ ] Large form inputs (48px height)
- [ ] Proper input types
- [ ] Swipeable image galleries
- [ ] Filter drawer with batch apply
- [ ] Digital wallets in checkout
- [ ] Optimized images for mobile (<500KB)
- [ ] Safe area insets for iOS
- [ ] Test on real mobile devices