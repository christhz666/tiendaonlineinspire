# Megamenu Component

## Contents

- [Overview](#overview)
- [Structure](#structure)
- [Positioning](#positioning)
- [Mobile Considerations](#mobile-considerations)

## Overview

Megamenu displays categories and subcategories on desktop. Provides organized navigation for stores with many categories.

## Structure

```tsx
<div className="relative group">
  {/* Trigger */}
  <button>Categories</button>

  {/* Menu Panel */}
  <div className="absolute left-0 w-full hidden group-hover:block">
    <div className="grid grid-cols-4 gap-8 p-8 bg-white shadow-lg">
      {/* Column 1 */}
      <div>
        <h3>Category 1</h3>
        <nav>
          <Link href="/cat1/sub1">Subcategory</Link>
          <Link href="/cat1/sub2">Subcategory</Link>
        </nav>
      </div>

      {/* Featured Products */}
      <div className="col-span-2">
        <h3>Featured</h3>
        <div className="grid grid-cols-2">
          <ProductCard product={featured[0]} />
          <ProductCard product={featured[1]} />
        </div>
      </div>
    </div>
  </div>
</div>
```

## Positioning

**CRITICAL for megamenu positioning:**

1. **Navbar must have `position: relative`:**
```tsx
<nav className="relative">...</nav>
```

2. **Megamenu must be `absolute`:**
```tsx
<div className="absolute left-0 w-full">...</div>
```

3. **Must span full width:**
```tsx
<div className="w-full">...</div>
```

## Mobile Considerations

**Do NOT use megamenu on mobile.**
- Use hamburger menu instead
- Full-screen drawer
- Category accordion