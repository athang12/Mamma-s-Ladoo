# Product Template Image Guide

## What You Need to Create

For each customizable product, you need **2 images**:

### 1. **Template Image** (with transparent design area)
- This is the base product image with the center area transparent
- The transparent area is where customers can place their designs
- File format: **PNG with transparency** (24-bit or 32-bit)
- Recommended size: **800x800px** or higher

### 2. **Mask Image** (optional, for perfect boundary clipping)
- This is just the product frame/border (the non-transparent parts)
- Used to clip any design that goes outside the design area
- Same size as template image
- File format: **PNG with transparency**

---

## How to Create Template Images

### Method 1: Using Photoshop

1. **Open your product image** in Photoshop
2. **Select the design area** (where customers will place their images):
   - Use **Magic Wand Tool** (W) for simple backgrounds
   - Or use **Pen Tool** (P) for precise selection
   - Or use **Rectangle/Ellipse Marquee Tool** for geometric shapes
3. **Delete the selected area**: Press Delete key
4. **Save as PNG**:
   - File → Export → Export As
   - Format: **PNG**
   - Check **Transparency**
   - Quality: High
   - Save as: `acrylic-stand-template.png`

5. **Create mask (optional but recommended)**:
   - Select → Inverse (to select the frame only)
   - Delete everything except the frame
   - Save as: `acrylic-stand-mask.png`

### Method 2: Using GIMP (Free Alternative)

1. **Open your product image**
2. **Add Alpha Channel**: Right-click layer → Add Alpha Channel
3. **Select design area**:
   - Use **Free Select Tool** or **Rectangle Select Tool**
4. **Delete selection**: Press Delete
5. **Export as PNG**:
   - File → Export As
   - Choose PNG
   - Save as: `acrylic-stand-template.png`

### Method 3: Using Figma (Online, Free)

1. **Upload your product image**
2. **Draw a shape** over the design area (Rectangle/Circle)
3. **Select both layers** → Right-click → **Use as Mask**
4. **Export**:
   - Select frame
   - Export → PNG
   - Check **Transparency**

### Method 4: Using Canva (Simple)

1. Upload product image
2. Use **Background Remover** to remove the design area
3. Download as PNG (Pro feature for transparency)

---

## Example Structure

```
/public/images/product-templates/
├── acrylic-stand-template.png     (800x800px, transparent center)
├── acrylic-stand-mask.png          (800x800px, frame only)
├── wall-frame-template.png
├── wall-frame-mask.png
├── fridge-magnet-template.png
└── fridge-magnet-mask.png
```

---

## Design Area Specifications

For best results:

### Acrylic Stand
- **Total size**: 800x800px
- **Design area**: 400x600px (centered)
- **Transparent area**: Rectangle in the center

### Wall Frame
- **Total size**: 800x800px
- **Design area**: 600x600px (centered)
- **Transparent area**: Square in the center

### Fridge Magnet
- **Total size**: 600x600px
- **Design area**: 400x400px (centered)
- **Transparent area**: Circle or square

---

## Testing Your Template

1. Open the PNG in any image viewer
2. Check the transparent area shows a **checkerboard pattern**
3. Make sure edges are clean (no white/gray halos)
4. Test at 100% zoom to see pixel-perfect edges

---

## Common Issues & Fixes

### Issue: White/gray edges around transparent area
**Fix**: Use "Select → Modify → Expand" by 1-2px before deleting

### Issue: Jagged edges
**Fix**: Apply a 1px feather/blur to selection before deleting

### Issue: File too large
**Fix**: Use PNG-8 instead of PNG-24 if colors < 256

---

## Quick AI Generation Option

If you don't have design software:

1. **Upload your product image** to remove.bg or Canva
2. **Remove the center area** manually
3. **Download as PNG** with transparency

Or send me your product images and I can help create templates!

---

## Integration with Your Site

Once you have the images, update your product in the database:

```sql
UPDATE products 
SET 
  template_image = '/images/product-templates/acrylic-stand-template.png',
  mask_image = '/images/product-templates/acrylic-stand-mask.png',
  max_images = 1
WHERE name = 'Acrylic Stand';
```

The new canvas editor will automatically:
- Load the template as background
- Allow customers to drag/resize images
- Clip anything outside the transparent area using the mask
