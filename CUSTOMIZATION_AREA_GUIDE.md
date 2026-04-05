# Product Template Configuration Guide

## How to Specify Customization Areas

This guide explains how to tell the system where to place custom images on your product photos.

---

## Understanding the Configuration

Each product needs these specifications:

### 1. **Position** (top, left)
- Measured as **percentage from top-left corner** of the product image
- `top: 20` means 20% down from the top
- `left: 30` means 30% in from the left edge

### 2. **Size** (width, height)
- Measured as **percentage of the product image** size
- `width: 60` means the custom area is 60% of the product width
- `height: 50` means the custom area is 50% of the product height

### 3. **Fit Mode**
- `contain`: Keep aspect ratio, fit inside (recommended for most)
- `cover`: Fill the entire area, may crop
- `fill`: Stretch to fill, may distort

---

## Easy Method to Find Your Values

### Method 1: Using Any Image Editor

1. Open your product image in **Preview (Mac)** or **Paint (Windows)**
2. Use the selection tool to draw a rectangle where you want the custom image
3. Note the coordinates shown at the bottom
4. Calculate percentages:
   ```
   top % = (Y coordinate / Image Height) × 100
   left % = (X coordinate / Image Width) × 100
   width % = (Selection Width / Image Width) × 100
   height % = (Selection Height / Image Height) × 100
   ```

### Method 2: Visual Estimation

For your **acrylic_stand.png**, estimate like this:

```
If the custom area should be:
- Centered: top: 25, left: 25, width: 50, height: 50
- Top half: top: 10, left: 20, width: 60, height: 40
- Full image: top: 5, left: 5, width: 90, height: 90
```

---

## Example Configurations

### Example 1: Centered Design (Most Common)
```typescript
customArea: {
  top: 20,      // Start 20% from top
  left: 20,     // Start 20% from left
  width: 60,    // Take 60% of width
  height: 60,   // Take 60% of height
  fit: 'contain'
}
```

### Example 2: Full Coverage (Puzzle)
```typescript
customArea: {
  top: 0,       // Start at very top
  left: 0,      // Start at very left
  width: 100,   // Full width
  height: 100,  // Full height
  fit: 'cover'
}
```

### Example 3: Corner Design (Handkerchief)
```typescript
customArea: {
  top: 65,      // Bottom area
  left: 65,     // Right area
  width: 30,    // Small size
  height: 30,
  fit: 'contain'
}
```

---

## For Your Acrylic Stand

### Current Settings (in productTemplates.ts):
```typescript
{
  id: 'acrylic-stand',
  productType: 'ACRYLIC_STANDS',
  baseImage: '/images/product-templates/acrylic-stand.png',
  customArea: {
    top: 20,        // ← Adjust this
    left: 20,       // ← Adjust this
    width: 60,      // ← Adjust this
    height: 60,     // ← Adjust this
    fit: 'contain',
  },
}
```

### To Update:
1. Look at your acrylic_stand.png image
2. Identify where the custom design should appear
3. Estimate or measure the position/size percentages
4. Update the values in `/lib/constants/productTemplates.ts`

---

## Testing Your Configuration

After updating the values:

1. Go to http://localhost:3000/products
2. Click any "Custom Photo Acrylic Stand" product
3. Upload a test image
4. Edit and continue to preview
5. Check if the image appears in the correct position
6. Adjust the values if needed

---

## For Other Products

When you get product photos for Mugs, Tote Bags, etc.:

1. Add the image to: `public/images/product-templates/`
2. Name it: `[product-type]-base.png` (e.g., `mug-base.png`)
3. Update the config in `productTemplates.ts`
4. Set the customization area values
5. Test with the customization tool

---

## Quick Reference

| Value | What it controls |
|-------|------------------|
| `top` | Distance from top edge (0-100%) |
| `left` | Distance from left edge (0-100%) |
| `width` | How wide the custom area is (0-100%) |
| `height` | How tall the custom area is (0-100%) |
| `fit: 'contain'` | Keep proportions, fit inside |
| `fit: 'cover'` | Fill area, may crop edges |
| `fit: 'fill'` | Stretch to fill |

---

## Need Help?

If you're unsure about the values:
1. Start with centered defaults (top: 20, left: 20, width: 60, height: 60)
2. Test it
3. Adjust incrementally until it looks right
4. Common adjustments are in steps of 5 or 10

**Remember**: These are just percentages, so they'll work even if your image size changes!
