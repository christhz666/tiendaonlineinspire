# SEO Optimization for Ecommerce Storefronts

## Contents

- [Overview](#overview)
- [Meta Tags Requirements](#meta-tags-requirements)
- [Structured Data (Critical for Ecommerce)](#structured-data-critical-for-ecommerce)
- [Ecommerce URL Patterns](#ecommerce-url-patterns)
- [Product Page SEO](#product-page-seo)
- [Duplicate Content Issues](#duplicate-content-issues)
- [Common SEO Mistakes](#common-seo-mistakes)

## Overview

SEO is critical for ecommerce - organic search drives high-intent traffic. Proper implementation helps search engines understand products and enables rich results.

### Every Product Page Needs

- Unique title and description
- Product schema with price, availability
- Breadcrumb schema
- Canonical URL
- Descriptive image alt text
- Fast load time (LCP < 2.5s)

## Meta Tags Requirements

Generate unique meta tags for every product page:
- **Title**: "Product Name - Key Feature | Store Name" (50-60 characters)
- **Description**: Key features + USP (150-160 characters)
- **Open Graph** tags for social sharing
- **Canonical URL** for variants

## Structured Data (Critical for Ecommerce)

Enables rich results in search (star ratings, price, availability).

### Product Schema (Required on All Product Pages)

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product Name",
  "description": "Description",
  "image": "image-url.jpg",
  "sku": "SKU",
  "brand": { "@type": "Brand", "name": "Brand" },
  "offers": {
    "@type": "Offer",
    "price": "99.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

**Critical**: `availability` must be dynamic and accurate.

### AggregateRating Schema (When Reviews Exist)

Add when real reviews exist:
- `ratingValue`: Average rating
- `reviewCount`: Total reviews

### Breadcrumb Schema

Home → Category → Product hierarchy.

## Ecommerce URL Patterns

**Product URLs**: Use readable slugs (`/products/wireless-headphones-pro`)

**Category URLs**: Choose consistent structure:
- Hierarchical (`/categories/electronics/laptops`)
- Flat (`/categories/laptops`)

**Pagination URLs**: Use query parameters (`/products?page=2`)

**Canonical decision for filters:**
- Few filters: Index filtered pages
- Many filters: Canonical to unfiltered

## Product Page SEO

**Title tags**: "Product Name - Key Feature | Store Name" (50-60 chars)

**Meta descriptions**: Include free shipping, returns, warranty

**Image alt text**: Descriptive, include product name

## Duplicate Content Issues

### Ecommerce Duplicate Content Challenges

1. Product variants (same product in multiple colors/sizes)
2. Multiple categories
3. Filter combinations

### Solution: Canonical URLs

**Variant handling:**
- Choose one variant as canonical
- All other variants canonical to default

**Filtered/sorted views:**
- Canonical to unfiltered, default-sorted page

## Common SEO Mistakes

1. **Duplicate content** - Same product via multiple URLs
2. **Missing Product schema** - No structured data
3. **Incorrect availability status** - Marking out-of-stock as "InStock"
4. **Thin product content** - Only image and price
5. **Static sitemap** - Never updates

## SEO Checklist

### On Every Product Page

- [ ] Unique title tag (50-60 characters)
- [ ] Unique meta description (150-160 characters)
- [ ] Open Graph and Twitter Card tags
- [ ] Product schema with price, availability, rating
- [ ] Breadcrumb schema
- [ ] Descriptive alt text
- [ ] Canonical URL
- [ ] Fast load time (LCP < 2.5s)
- [ ] Mobile-responsive design
- [ ] Detailed product description

### Site-wide

- [ ] Dynamic XML sitemap
- [ ] Robots.txt properly configured
- [ ] SSL certificate (HTTPS)
- [ ] Organization schema on homepage
- [ ] Proper heading hierarchy