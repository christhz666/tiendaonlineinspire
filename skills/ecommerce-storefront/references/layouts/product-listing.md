# Product Listing Layout

## Contents

- [Overview](#overview)
- [Features](#features)
- [Structure](#structure)
- [Filtering](#filtering)
- [Pagination](#pagination)

## Overview

Product listing displays products in a grid with filtering and sorting. Used on category pages and search results.

## Features

**Must include:**
- Product grid
- Sort options (price, newest, popular)
- Filters (category, price, size, color)
- Pagination or infinite scroll

**Should include:**
- Active filter display
- Clear filters option
- Results count

## Structure

```tsx
<div className="container mx-auto">
  {/* Header */}
  <div className="mb-6">
    <h1>Category Name</h1>
    <p>{productCount} products</p>
  </div>

  {/* Toolbar */}
  <div className="flex justify-between mb-6">
    <button onClick={() => setShowFilters(true)}>
      Filters ({activeFilterCount})
    </button>
    <select onChange={handleSort}>
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  </div>

  {/* Filters Sidebar (mobile: drawer) */}
  <aside>
    {/* Filter groups */}
    <fieldset>
      <legend>Category</legend>
      <Checkboxes categories={categories} />
    </fieldset>
    <fieldset>
      <legend>Price</legend>
      <Inputs min={0} max={max} />
    </fieldset>
  </aside>

  {/* Product Grid */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>

  {/* Empty State */}
  {products.length === 0 && (
    <div>
      <p>No products found</p>
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  )}

  {/* Pagination */}
  <div className="flex justify-center gap-2">
    <button disabled={!hasPrev}>Previous</button>
    {pages.map(page => (
      <button key={page}>{page}</button>
    ))}
    <button disabled={!hasNext}>Next</button>
  </div>
</div>
```

## Filtering

**Filter types:**
- Category (checkboxes)
- Price range (min/max inputs)
- Size (checkboxes)
- Color (swatches)
- Brand (checkboxes)

**Mobile:** Use drawer with "Apply" button

## Pagination

**Options:**
- Numbered pages (1, 2, 3...)
- Load more button
- Infinite scroll

**SEO-friendly URLs:** Use query parameters