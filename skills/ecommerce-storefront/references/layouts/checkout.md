# Checkout Layout

## Contents

- [Overview](#overview)
- [Structure](#structure)
- [Steps](#steps)
- [Payment](#payment)
- [Optimization Tips](#optimization-tips)

## Overview

Checkout is the final conversion step. Keep it simple and trustworthy to maximize conversion.

**Optimal:** 3 steps (Shipping Info, Delivery + Payment, Review)

## Structure

```tsx
<div className="container mx-auto">
  <h1>Checkout</h1>

  {/* Progress */}
  <div className="flex gap-4 mb-8">
    <span className={step >= 1 ? 'text-green-500' : ''}>1. Shipping</span>
    <span className={step >= 2 ? 'text-green-500' : ''}>2. Payment</span>
    <span className={step >= 3 ? 'text-green-500' : ''}>3. Review</span>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Form */}
    <div className="lg:col-span-2">
      {step === 1 && <ShippingForm />}
      {step === 2 && <PaymentForm />}
      {step === 3 && <Review />}
    </div>

    {/* Order Summary */}
    <div className="bg-gray-50 p-6 h-fit">
      <h2>Order Summary</h2>
      {cartItems.map(item => (
        <div key={item.id} className="flex gap-2">
          <img src={item.thumbnail} />
          <div>
            <p>{item.title}</p>
            <p className="text-sm">{item.variant.title}</p>
            <p>x{item.quantity}</p>
          </div>
          <div>{formatPrice(item.price * item.quantity)}</div>
        </div>
      ))}
      <div className="border-t mt-4 pt-4">
        <p>Subtotal: {formatPrice(subtotal)}</p>
        <p>Shipping: {formatPrice(shipping)}</p>
        <p>Tax: {formatPrice(tax)}</p>
        <p>Total: {formatPrice(total)}</p>
      </div>
    </div>
  </div>
</div>
```

## Steps

### Step 1: Shipping Address
- Email input
- Shipping address form
- Optional: Save for logged-in users

### Step 2: Delivery + Payment
- Shipping method selection (from cart's region)
- Payment method selection
- Fetch available options from backend

### Step 3: Review
- Order summary
- Edit links
- Place order button

## Payment

**CRITICAL:** 
- Fetch available payment methods from backend
- Never assume payment options
- Digital wallets prominent (Apple Pay, Google Pay)

## Optimization Tips

- **Guest checkout**: Don't require account
- **Trust signals**: Show security badges, return policy
- **Progress**: Show current step
- **Minimal steps**: 3 is optimal, 4+ kills conversion
- **Save information**: For returning customers