// Product Template Configuration
// This defines where custom images should be placed on each product type

export interface CustomizationArea {
  // Position as percentage from top-left corner (0-100)
  top: number
  left: number
  
  // Size as percentage of product image (0-100)
  width: number
  height: number
  
  // How the custom image should fit in the area
  fit: 'cover' | 'contain' | 'fill'
  
  // Optional: Rotation in degrees
  rotation?: number
  
  // Optional: Perspective/3D effect
  perspective?: {
    enabled: boolean
    angle?: number
  }
}

export interface ProductTemplate {
  id: string
  productType: string
  displayName: string
  
  // Path to the base product image (relative to /public)
  baseImage: string
  
  // Customization area configuration
  customArea: CustomizationArea
  
  // Optional: Different images for different colors
  colorVariants?: {
    [colorName: string]: string // path to image
  }
}

// ============================================
// PRODUCT TEMPLATES CONFIGURATION
// ============================================

export const productTemplates: ProductTemplate[] = [
  // ACRYLIC STAND
  {
    id: 'acrylic-stand',
    productType: 'ACRYLIC_STANDS',
    displayName: 'Acrylic Stand',
    baseImage: '/images/product-templates/acrylic-stand.png',
    customArea: {
      // TO CONFIGURE: Adjust these values based on your image
      // Example: If custom area is centered and takes 60% of the stand
      top: 20,        // 20% from top
      left: 20,       // 20% from left
      width: 60,      // 60% of product width
      height: 60,     // 60% of product height
      fit: 'contain', // Keep aspect ratio
    },
  },

  // COFFEE MUG
  {
    id: 'coffee-mug',
    productType: 'COFFEE_MUGS',
    displayName: 'Coffee Mug',
    baseImage: '/images/product-templates/mug-base.png', // Add this image
    customArea: {
      top: 25,
      left: 30,
      width: 40,
      height: 50,
      fit: 'cover',
      perspective: {
        enabled: true, // Wrap around mug
        angle: 15,
      },
    },
  },

  // JIGSAW PUZZLE
  {
    id: 'jigsaw-puzzle',
    productType: 'JIGSAW_PUZZLES',
    displayName: 'Jigsaw Puzzle',
    baseImage: '/images/product-templates/puzzle-base.png', // Add this image
    customArea: {
      top: 5,
      left: 5,
      width: 90,
      height: 90,
      fit: 'cover', // Full coverage
    },
  },

  // TOTE BAG
  {
    id: 'tote-bag',
    productType: 'TOTE_BAGS',
    displayName: 'Tote Bag',
    baseImage: '/images/product-templates/tote-bag-base.png', // Add this image
    customArea: {
      top: 30,
      left: 25,
      width: 50,
      height: 40,
      fit: 'contain',
    },
  },

  // DAILY PLANNER
  {
    id: 'daily-planner',
    productType: 'DAILY_PLANNERS',
    displayName: 'Daily Planner',
    baseImage: '/images/product-templates/planner-base.png', // Add this image
    customArea: {
      top: 10,
      left: 15,
      width: 70,
      height: 80,
      fit: 'cover',
    },
  },

  // HANDKERCHIEF
  {
    id: 'handkerchief',
    productType: 'HANDKERCHIEFS',
    displayName: 'Handkerchief',
    baseImage: '/images/product-templates/handkerchief-base.png', // Add this image
    customArea: {
      top: 60,    // Bottom right corner
      left: 60,
      width: 35,
      height: 35,
      fit: 'contain',
    },
  },

  // WALL FRAME
  {
    id: 'wall-frame',
    productType: 'WALL_FRAMES',
    displayName: 'Wall Frame',
    baseImage: '/images/product-templates/frame-base.png', // Add this image
    customArea: {
      top: 10,
      left: 10,
      width: 80,
      height: 80,
      fit: 'cover',
    },
  },

  // FRIDGE MAGNET
  {
    id: 'fridge-magnet',
    productType: 'FRIDGE_MAGNETS',
    displayName: 'Fridge Magnet',
    baseImage: '/images/product-templates/magnet-base.png', // Add this image
    customArea: {
      top: 15,
      left: 15,
      width: 70,
      height: 70,
      fit: 'cover',
    },
  },
]

// Helper function to get template by product type
export function getProductTemplate(productType: string): ProductTemplate | undefined {
  return productTemplates.find(t => t.productType === productType)
}

// Helper function to get template by product category slug
export function getTemplateByCategory(categorySlug: string): ProductTemplate | undefined {
  return productTemplates.find(t => t.productType === categorySlug)
}
