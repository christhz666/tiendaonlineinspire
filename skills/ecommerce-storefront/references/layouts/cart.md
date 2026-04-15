# Cart Layout

## Contents

- [Overview](#overview)
- [Structure](#structure)
- [Cart Items](#cart-items)
- [Summary](#summary)
- [Empty Cart](#empty-cart)

## Overview

Cart page displays items added to cart with options to update quantities or remove items.

## Structure

```tsx
<div className="container mx-auto">
  <h1>Shopping Cart</h1>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Cart Items */}
    <div className="lg:col-span-2">
      {cartItems.length > 0 ? (
        <CartItems items={cartItems} />
      ) : (
        <EmptyCart />
      )}
    </div>

    {/* Order Summary */}
    <div>
      <div className="bg-gray-50 p-6">
        <h2>Order Summary</h2>
        
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping > 0 ? formatPrice(shipping) : 'Calculated at checkout'}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <Link href="/checkout" className="btn-primary w-full mt-6">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  </div>
</div>
```

## Cart Items

```tsx
<div className="space-y-6">
  {items.map(item => (
    <div key={item.id} className="flex gap-4">
      <Link href={`/products/${item.product.handle}`}>
        <img src={item.thumbnail} alt={item.title} />
      </Link>
      
      <div className="flex-1">
        <Link href={`/products/${item.product.handle}`}>
          <h3>{item.title}</h3>
        </Link>
        <p className="text-sm">{item.variant.title}</p>
        
        {/* Quantity */}
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
      </div>
      
      <div>{formatPrice(item.price * item.quantity)}</div>
      
      <button onClick={() => removeItem(item.id)}>Remove</button>
    </div>
  ))}
</div>
```

## Empty Cart

```tsx
<div className="text-center py-12">
  <p>Your cart is empty</p>
  <Link href="/products" className="btn-primary mt-4">
    Continue Shopping
  </Link>
</div>
```

## Minimum Requirements

- Product name and variant details
- Quantity selector
- Remove option
- Subtotal display
- Checkout link