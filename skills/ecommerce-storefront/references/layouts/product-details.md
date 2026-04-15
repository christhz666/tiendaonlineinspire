# Product Details Layout

## Contents

- [Overview](#overview)
- [Structure](#structure)
- [Image Gallery](#image-gallery)
- [Variant Selection](#variant-selection)
- [Add to Cart](#add-to-cart)
- [Related Products](#related-products)

## Overview

Product details page displays full product information. Includes images, variant selection, and purchase options.

## Structure

```tsx
<div className="container mx-auto">
  <Breadcrumbs product={product} />

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Image Gallery */}
    <ImageGallery images={product.images} />

    {/* Product Info */}
    <div>
      <h1>{product.title}</h1>
      
      {/* Price */}
      <div className="text-2xl mt-2">
        {formatPrice(product.price)}
      </div>

      {/* Variant Selection */}
      {product.variants.length > 1 && (
        <div className="mt-6">
          {/* Size */}
          <fieldset>
            <legend>Size</legend>
            <div className="flex gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  className={selectedSize === size ? 'border-2' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Color */}
          <fieldset>
            <legend>Color</legend>
            <div className="flex gap-2">
              {colors.map(color => (
                <button
                  className={selectedColor === color ? 'ring-2' : ''}
                  style={{ background: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {/* Quantity */}
      <div className="mt-6">
        <label>Quantity</label>
        <div className="flex items-center gap-2">
          <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={() => addToCart(selectedVariant, qty)}
        disabled={!selectedVariant || !product.available}
        className="w-full mt-6"
      >
        {product.available ? 'Add to Cart' : 'Out of Stock'}
      </button>

      {/* Description */}
      <div className="mt-8">
        <h2>Description</h2>
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>
    </div>
  </div>

  {/* Related Products */}
  <RelatedProducts products={related} />
</div>
```

## Image Gallery

- Full-width swipeable carousel
- Thumbnail navigation
- Pinch to zoom
- Tap for full-screen

## Variant Selection

**MUST:**
- Require variant selection before adding to cart
- Show price for selected variant
- Disable add to cart until variant selected

## Related Products

Show 4-8 related products below