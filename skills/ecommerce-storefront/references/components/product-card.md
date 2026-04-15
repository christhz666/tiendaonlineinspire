# Product Card Component

## Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Structure](#structure)
- [Pricing Display](#pricing-display)
- [Accessibility](#accessibility)

## Overview

Product cards display individual products in grids and lists. Used on homepage, category pages, and related products sections.

## Requirements

**Must display:**
- Product image (with link to product page)
- Product title/name
- Price (current and sale if applicable)
- Add to Cart button (or quick add)

**Should display (optional):**
- Sale badge/discount percentage
- Out of stock indicator
- Wishlist button

## Structure

```tsx
<article className="group">
  {/* Image */}
  <Link href={`/products/${product.handle}`}>
    <img
      src={product.thumbnail}
      alt={product.title}
      className="w-full aspect-square object-cover"
      loading="lazy"
    />
  </Link>

  {/* Content */}
  <div className="mt-4">
    <Link href={`/products/${product.handle}`}>
      <h3>{product.title}</h3>
    </Link>

    {/* Price */}
    <div className="mt-1">
      {product.sale_price ? (
        <>
          <span className="text-red-500">{formattedSalePrice}</span>
          <span className="text-gray-400 line-through ml-2">{formattedPrice}</span>
        </>
      ) : (
        <span>{formattedPrice}</span>
      )}
    </div>

    {/* Add to Cart */}
    <button
      onClick={() => addToCart(product.id)}
      disabled={!product.available}
      className="mt-3 w-full"
    >
      {product.available ? 'Add to Cart' : 'Out of Stock'}
    </button>
  </div>
</article>
```

## Pricing Display

**Medusa**: Display prices as-is (DO NOT divide by 100)

```typescript
const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
```

## Accessibility

- Use semantic `<article>` element
- Include descriptive alt text for images
- Ensure button is keyboard accessible
- Show clear disabled state for out of stock

## Image Optimization

- Always use `loading="lazy"` for images below fold
- Optimize product images for mobile (<500KB)
- Use responsive images with appropriate sizes