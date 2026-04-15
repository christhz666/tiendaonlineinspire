# Hero Component

## Contents

- [Overview](#overview)
- [Structure](#structure)
- [Content Options](#content-options)
- [Mobile Considerations](#mobile-considerations)

## Overview

Hero is the primary visual element on homepage. Draws attention and provides clear call-to-action.

## Structure

```tsx
<section className="relative">
  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="/hero.jpg"
      alt="Hero"
      className="w-full h-full object-cover"
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40" />
  </div>

  {/* Content */}
  <div className="relative container mx-auto px-4 py-24">
    <div className="max-w-xl">
      <h1>Welcome to Our Store</h1>
      <p>Discover amazing products</p>
      <Link href="/products" className="btn-primary">
        Shop Now
      </Link>
    </div>
  </div>
</section>
```

## Content Options

**Headline:** Catchy, benefit-driven
**Subheadline:** Additional context
**CTA Button:** Clear action (Shop Now, Learn More)

**Layouts:**
- Centered content
- Left-aligned content
- Right-aligned content
- Full-screen background

## Mobile Considerations

- Responsive text sizes
- Stack elements vertically
- Large CTA button (min 44x44px)
- Fast loading images