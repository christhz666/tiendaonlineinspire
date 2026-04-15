# Cart Popup Component

## Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Behavior](#behavior)
- [Display](#display)
- [Mobile Considerations](#mobile-considerations)

## Overview

Cart popup shows confirmation when items are added to cart. Provides quick access to view cart or continue shopping.

## Requirements

**Must include:**
- Product name
- Variant details (size, color)
- Quantity added
- Subtotal
- Links to "View Cart" and "Continue Shopping"
- Close button

## Behavior

**Trigger:** When user clicks "Add to Cart"
- Show popup/drawer
- Auto-close after 3-5 seconds OR when user clicks outside
- Or: Close when navigating to cart

## Display

```tsx
{/* Popup container */}
<div className="fixed inset-0 z-50">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/50" onClick={onClose} />

  {/* Popup */}
  <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h2>Added to Cart</h2>
      <button onClick={onClose}>×</button>
    </div>

    {/* Product */}
    <div className="flex gap-4">
      <img src={item.thumbnail} alt={item.title} className="w-20 h-20" />
      <div>
        <h3>{item.title}</h3>
        <p className="text-sm text-gray-500">
          {item.variant.title} × {item.quantity}
        </p>
      </div>
    </div>

    {/* Subtotal */}
    <div className="mt-4 pt-4 border-t">
      <p>Subtotal: {formatPrice(cartTotal)}</p>
    </div>

    {/* Actions */}
    <div className="mt-4 flex gap-4">
      <Link href="/cart" className="flex-1 btn-secondary">
        View Cart
      </Link>
      <Link href="/checkout" className="flex-1 btn-primary">
        Checkout
      </Link>
    </div>
  </div>
</div>
```

## Mobile Considerations

Same behavior as desktop
- Full-width on mobile
- Bottom sheet or full-screen overlay
- Easy to dismiss

## Accessibility

- Use proper heading hierarchy
- Focus trap within popup
- Close on Escape key
- Include aria-label on close button