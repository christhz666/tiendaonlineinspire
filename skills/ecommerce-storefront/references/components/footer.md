# Footer Component

## Contents

- [Overview](#overview)
- [Structure](#structure)
- [Content Organization](#content-organization)
- [Mobile Considerations](#mobile-considerations)

## Overview

Footer appears on every page and provides secondary navigation, legal links, and contact information.

## Structure

```tsx
<footer className="bg-gray-900 text-white">
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Brand */}
      <div>
        <h3>Store Name</h3>
        <p className="text-gray-400">Store description</p>
      </div>

      {/* Shop Links */}
      <div>
        <h4>Shop</h4>
        <nav>
          <Link href="/products">All Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/new">New Arrivals</Link>
        </nav>
      </div>

      {/* Customer Links */}
      <div>
        <h4>Customer Service</h4>
        <nav>
          <Link href="/contact">Contact Us</Link>
          <Link href="/shipping">Shipping</Link>
          <Link href="/returns">Returns</Link>
        </nav>
      </div>

      {/* Newsletter */}
      <div>
        <h4>Newsletter</h4>
        <form>
          <input type="email" placeholder="Your email" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>

    {/* Bottom */}
    <div className="border-t mt-8 pt-8 flex justify-between">
      <p>&copy; 2024 Store Name</p>
      <div className="flex gap-4">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
    </div>
  </div>
</footer>
```

## Content Organization

**Common sections:**
- Brand info (logo, description, social links)
- Shop navigation (products, categories, sale)
- Customer service (contact, shipping, returns, FAQ)
- Account (login, orders, wishlist)
- Newsletter signup
- Legal links

## Mobile Considerations

- Stack columns vertically
- Good touch targets (44x44px)
- Expandable sections with accordion