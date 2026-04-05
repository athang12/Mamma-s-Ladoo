# 🧪 Testing Guide - Phase 2+3

## How to Test the New Features

### Prerequisites
Make sure the development server is running:
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🎨 Theme Testing

### Test Theme Switching
1. Look for the **Palette icon** 🎨 in the top right of the header
2. Click to open the theme selector dropdown
3. Try each theme:
   - **Aesthetic** (default) - Dreamy pink/lavender
   - **Anime** - Vibrant pink/blue
   - **Motivation** - Energetic orange/blue
   - **Valentine** - Romantic pink/red

4. **Expected Behavior**:
   - Colors change immediately
   - Theme persists on page reload
   - All buttons, cards, and accents update
   - Fonts may change for headings

### Visual Checks
- ✅ Primary buttons have theme colors
- ✅ Links change color on hover
- ✅ Product cards use theme shadows
- ✅ Price text uses theme gradients
- ✅ Header cart icon has theme-colored badge

---

## 📱 Mobile Testing

### Desktop Testing (Resize Browser)
1. **Open Chrome DevTools** (F12 or Cmd+Opt+I)
2. **Toggle Device Toolbar** (Cmd+Shift+M or Ctrl+Shift+M)
3. **Test these viewports**:
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - iPad Pro (1024x1366)

### Mobile Features to Test

#### 1. Mobile Navigation
- **Desktop (≥768px)**: 
  - Top navigation links visible
  - No bottom nav bar
  
- **Mobile (<768px)**:
  - Bottom nav bar visible with 4 icons
  - Active page highlighted in pink
  - Tap each icon to navigate

#### 2. Mobile Menu (Header)
- **Click hamburger icon** (☰) on mobile
- **Expected**:
  - Full-screen overlay appears
  - Navigation links in large text
  - Close with ✕ or backdrop click
  - Body scroll locked while open

#### 3. Touch Targets
- All buttons should be easy to tap (44px minimum)
- No blue highlight flash on tap
- Smooth tap feedback

#### 4. Responsive Layouts
- **Home Page**:
  - Hero: 1 column on mobile, 2 on desktop
  - Categories: 1→2→3 columns
  - Products: 1→2→3→4 columns
  - Testimonials: 1→2→3 columns

- **Cart Page**:
  - Mobile: Stacked layout
  - Desktop: Sidebar with order summary

#### 5. Typography Scaling
- Headings should scale down on mobile
- Text remains readable at all sizes
- No horizontal scrolling

---

## 🛒 Cart Testing

### Add Items to Cart
1. Go to Products page (or click featured products)
2. Click "Add" button on any product card
3. Cart badge in header should increment
4. Click cart icon to view cart

### Cart Page Features
- **Mobile**: 
  - Compact card layout
  - Smaller images (16px on mobile)
  - Touch-friendly +/- buttons
  
- **Desktop**:
  - Larger images (24px)
  - Order summary sticky on right

### Test Quantity Controls
- Click ➖ to decrease (min: 1)
- Click ➕ to increase
- Click trash icon 🗑️ to remove item
- Total price updates immediately

---

## 🎯 Specific Test Cases

### Test Case 1: Theme Persistence
1. Select "Anime" theme
2. Navigate to different pages
3. Refresh browser (F5)
4. **Expected**: Anime theme still active

### Test Case 2: Mobile Menu
1. Open mobile menu (hamburger icon)
2. Try scrolling the page
3. **Expected**: Body scroll is locked
4. Click "Products" link
5. **Expected**: Menu closes, navigates to products

### Test Case 3: Bottom Nav Active State
1. On mobile, navigate to each page
2. **Expected**: Bottom nav icon for current page is pink
3. Other icons are gray

### Test Case 4: Cart Badge
1. Clear cart (remove all items)
2. **Expected**: Badge disappears
3. Add 3 items
4. **Expected**: Badge shows "3"

### Test Case 5: Responsive Images
1. Resize browser from desktop to mobile
2. **Expected**: 
   - Hero images scale smoothly
   - Product cards adjust height
   - No broken layouts

### Test Case 6: Theme Colors on Components
1. Select "Motivation" theme (orange/blue)
2. Check these elements:
   - Primary buttons → Orange gradient
   - Links on hover → Orange
   - Product prices → Orange gradient
   - Active states → Orange

---

## 🐛 Known Issues to Watch For

### Potential Issues:
- ❓ Theme may not apply immediately on first load (refresh fixes)
- ❓ Mobile menu may briefly show on desktop during page load
- ❓ Cart badge might show "0" momentarily before hiding

### Fixes Applied:
- ✅ Hydration error on cart badge (fixed with mounted state)
- ✅ Theme selector dropdown closing issues (backdrop click works)
- ✅ Mobile menu scroll lock (body overflow controlled)

---

## 📊 Performance Checks

### Load Times
- Initial page load: <3 seconds
- Theme switch: Instant
- Page navigation: <1 second

### Smooth Scrolling
- No janky scroll on mobile
- Smooth page transitions
- No layout shifts

### Image Loading
- Hero images: Load immediately (eager)
- Product images: Lazy load as you scroll
- Thumbnails: Proper aspect ratio maintained

---

## ✅ Test Checklist

Copy this checklist and mark items as you test:

### Theme System
- [ ] All 4 themes switch correctly
- [ ] Theme persists after reload
- [ ] Colors apply to buttons, links, cards
- [ ] Fonts change for some themes

### Mobile UI
- [ ] Bottom nav shows on mobile only
- [ ] Active page highlighted in bottom nav
- [ ] Mobile menu opens/closes smoothly
- [ ] Body scroll locks when menu open
- [ ] All touch targets easy to tap

### Responsive Design
- [ ] Layouts adapt at breakpoints (640px, 768px, 1024px)
- [ ] No horizontal scrolling
- [ ] Text readable at all sizes
- [ ] Images scale properly

### Cart & Shopping
- [ ] Cart badge updates correctly
- [ ] Add to cart works
- [ ] Quantity controls work
- [ ] Remove item works
- [ ] Prices calculate correctly

### General
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Fast page loads
- [ ] Smooth interactions

---

## 🚀 Next Steps After Testing

Once testing is complete:
1. Fix any bugs found
2. Optimize images (convert to WebP)
3. Add product image swipe gestures
4. Move to **Phase 4**: Add new products with placeholders

---

## 📝 How to Report Issues

If you find bugs, note:
1. **What you did** (steps to reproduce)
2. **What happened** (actual behavior)
3. **What should happen** (expected behavior)
4. **Device/browser** (iPhone, Chrome, etc.)
5. **Screenshot** (if visual bug)

Example:
```
Bug: Theme doesn't persist after reload
Steps: Select Anime theme → Reload page
Expected: Anime theme still active
Actual: Returns to Aesthetic theme
Browser: Chrome on MacOS
```
