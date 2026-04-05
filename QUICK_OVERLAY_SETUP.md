# 🎯 How to Configure Custom Image Overlay for Your Products

## ✅ What's Done

Your **Acrylic Stand** is already configured! The system will now overlay custom images onto the product photo.

---

## 📋 To Configure Other Products

### Step 1: Add Product Photo
1. Save your product photo as: `[product-name]-base.png`
   - Example: `mug-base.png`, `tote-bag-base.png`
2. Put it in: `public/images/product-templates/`

### Step 2: Find the Customization Area

**Easy Method:**
1. Open the product image in any photo viewer
2. Imagine where the custom design should appear
3. Estimate the position using this grid:

```
┌────────────────────────────┐
│                            │ ← top: 0%
│    ┌──────────────┐       │
│    │              │       │ ← top: 20%
│    │   CUSTOM     │       │
│    │   AREA       │       │
│    │              │       │ ← top: 80%
│    └──────────────┘       │
│                            │ ← top: 100%
└────────────────────────────┘
 ↑              ↑
left: 0%    left: 100%
```

### Step 3: Update the Configuration

Open: `/lib/constants/productTemplates.ts`

Find the product section and update these values:

```typescript
{
  id: 'coffee-mug',
  productType: 'COFFEE_MUGS',
  baseImage: '/images/product-templates/mug-base.png',  // ← Add your image path
  customArea: {
    top: 25,      // ← Where to start from top (0-100)
    left: 30,     // ← Where to start from left (0-100)
    width: 40,    // ← How wide (0-100)
    height: 50,   // ← How tall (0-100)
    fit: 'contain', // ← 'contain' | 'cover' | 'fill'
  },
}
```

### Step 4: Test It!

1. Go to: http://localhost:3000/products
2. Click the custom product
3. Upload a test image
4. See if it appears in the right spot
5. Adjust values if needed

---

## 🎨 Example Configurations

### Centered Design (Most Common)
```typescript
customArea: {
  top: 20,
  left: 20,
  width: 60,
  height: 60,
  fit: 'contain'
}
```

### Full Coverage (Puzzle)
```typescript
customArea: {
  top: 0,
  left: 0,
  width: 100,
  height: 100,
  fit: 'cover'
}
```

### Corner Design (Handkerchief)
```typescript
customArea: {
  top: 65,
  left: 65,
  width: 30,
  height: 30,
  fit: 'contain'
}
```

---

## 🔧 Current Status

| Product | Status | Image | Config |
|---------|--------|-------|--------|
| ✅ Acrylic Stand | Configured | ✅ | ✅ |
| ⏳ Coffee Mug | Needs image | ❌ | ⏳ |
| ⏳ Jigsaw Puzzle | Needs image | ❌ | ⏳ |
| ⏳ Tote Bag | Needs image | ❌ | ⏳ |
| ⏳ Daily Planner | Needs image | ❌ | ⏳ |
| ⏳ Handkerchief | Needs image | ❌ | ⏳ |

---

## 💡 Tips

1. **Start with default values** (top: 20, left: 20, width: 60, height: 60)
2. **Test immediately** - Don't wait to configure all products
3. **Adjust in steps of 5 or 10** for easier control
4. **Use 'contain'** to preserve image proportions (recommended)
5. **Use 'cover'** to fill the entire area (may crop)

---

## ❓ Need to Adjust Acrylic Stand?

Current settings are in `/lib/constants/productTemplates.ts`:

```typescript
{
  id: 'acrylic-stand',
  customArea: {
    top: 20,      // ← Change these
    left: 20,     // ← Change these
    width: 60,    // ← Change these
    height: 60,   // ← Change these
    fit: 'contain',
  },
}
```

Just modify the numbers and refresh the page!

---

## 📞 Questions?

Refer to: [CUSTOMIZATION_AREA_GUIDE.md](./CUSTOMIZATION_AREA_GUIDE.md) for detailed explanations.
