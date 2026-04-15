---
name: ecommerce-storefront
description: >
  Comprehensive skill for building high-converting ecommerce storefronts with best practices for UI/UX, conversion optimization, SEO, and mobile responsiveness.
  Trigger: When building ANY storefront component including checkout pages, cart, payment flows, product pages, product listings, navigation, homepage, or ANY page/component in an ecommerce storefront.
license: Apache-2.0
metadata:
  author: medusajs
  version: "1.0"
---

# Ecommerce Storefront Best Practices

Comprehensive guidance for building modern, high-converting ecommerce storefronts covering UI/UX patterns, component design, layout structures, SEO optimization, and mobile responsiveness.

## When to Apply

**ALWAYS load this skill when working on ANY storefront task:**

- **Adding checkout page/flow** - Payment, shipping, order placement
- **Implementing cart** - Cart page, cart popup, add to cart functionality
- **Building product pages** - Product details, product listings, product grids
- **Creating navigation** - Navbar, megamenu, footer, mobile menu
- **Integrating Medusa backend** - SDK setup, cart, products, payment
- **Any storefront component** - Homepage, search, filters, account pages
- Building new ecommerce storefronts from scratch
- Improving existing shopping experiences and conversion rates
- Optimizing for usability, accessibility, and SEO
- Designing mobile-responsive ecommerce experiences

## Critical: Load Reference Files When Needed

**ALWAYS load reference/design.md BEFORE creating ANY UI component**
- Discovers existing design tokens (colors, fonts, spacing, patterns)
- Prevents introducing inconsistent styles
- Provides guardrails for maintaining brand consistency

**Load these references based on what you're implementing:**

- **Starting a new storefront?** → MUST load `reference/design.md` first
- **Connecting to backend API?** → MUST load `reference/connecting-to-backend.md` first
- **Connecting to Medusa backend?** → MUST load `reference/medusa.md` for SDK setup
- **Implementing homepage?** → MUST load navbar.md, hero.md, footer.md
- **Implementing navigation?** → MUST load navbar.md and optionally megamenu.md
- **Building product listing?** → MUST load product-listing.md first
- **Building product details?** → MUST load product-details.md first
- **Implementing checkout?** → MUST load checkout.md first

## Critical Ecommerce-Specific Patterns

### Accessibility
- **Cart count updates require `aria-live="polite"`** - Screen readers won't announce without it

### Mobile
- **Sticky bottom elements MUST use `env(safe-area-inset-bottom)`** - iOS home indicator will cut off purchase buttons
- 44px minimum touch targets for cart actions, variant selectors, quantity buttons

### Performance
- **ALWAYS add `loading="lazy"` to product images below fold**
- Optimize product images for mobile (<500KB)

### Conversion Optimization
- Clear CTAs throughout shopping flow
- Minimal friction in checkout
- Trust signals near purchase buttons

### SEO
- **Product schema (JSON-LD) required** - Critical for Google Shopping and rich snippets

### Visual Design
- **NEVER use emojis** in storefront UI - Use icons or images instead

### Backend Integration
- **Backend detection**: Check for backend directory or ask user
- **NEVER hardcode dynamic content**: Always fetch categories, products, etc. from backend

### Routing Patterns
- **ALWAYS use dynamic routes** for products and categories - NEVER create static pages
- Product pages: Use dynamic routes like `/products/[handle]`
- Category pages: Use dynamic routes like `/categories/[handle]`

## Reference Files

### General
```
reference/connecting-to-backend.md    - Backend detection, API setup, integration patterns
reference/medusa.md                  - Medusa SDK integration, pricing, regions
reference/design.md                   - User preferences, design tokens
reference/seo.md                      - Meta tags, structured data, Core Web Vitals
reference/mobile-responsiveness.md   - Mobile-first design, responsive breakpoints
```

### Components
```
reference/components/navbar.md        - Desktop/mobile navigation
reference/components/megamenu.md      - Category organization
reference/components/cart-popup.md     - Add-to-cart feedback
reference/components/country-selector.md - Region selection
reference/components/breadcrumbs.md   - Category hierarchy
reference/components/search.md        - Search functionality
reference/components/hero.md         - Hero layouts
reference/components/footer.md        - Footer content
reference/components/product-card.md    - Product display
```

### Layouts
```
reference/layouts/home-page.md          - Homepage structure
reference/layouts/product-listing.md  - Product grids, filters
reference/layouts/product-details.md - Variant selection, gallery
reference/layouts/cart.md            - Cart management
reference/layouts/checkout.md         - Checkout flow
```

## Common Mistakes to Avoid

**Cart and Navigation:**
- ❌ Hiding cart indicator in mobile hamburger menu
- ❌ Missing `aria-live="polite"` on cart count
- ❌ Hardcoding categories instead of fetching from backend
- ❌ Megamenu positioning errors

**Product Browsing:**
- ❌ Creating static routes for products
- ❌ Missing loading indicators
- ❌ No empty state handling

**Checkout:**
- ❌ Requiring account creation
- ❌ Complex multi-step checkout (4+ steps kills conversion)
- ❌ Missing trust signals

**Mobile:**
- ❌ Touch targets smaller than 44x44px
- ❌ Not using safe-area-insets
- ❌ Desktop-style hover menus

**Backend:**
- ❌ Guessing API method names
- ❌ Not handling loading/error states
- ❌ Not clearing cart after order placement

## Resources

- **Documentation**: https://docs.medusajs.com
- **MCP Server**: https://docs.medusajs.com/mcp
- **Reference**: See [references/](references/)