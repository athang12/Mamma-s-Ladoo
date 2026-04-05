import { Theme, ThemeName } from '@/types/theme'

export const THEMES: Record<string, Theme> = {
  all: {
    id: 'all',
    name: 'all',
    displayName: 'All Themes',
    description: 'Browse all products from every theme collection',
    colors: {
      primary: '#FF69B4',
      secondary: '#9C27B0',
      accent: '#E91E63',
      background: '#FFFFFF',
      text: '#333333',
      textSecondary: '#666666',
      border: '#E0E0E0',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
    },
    images: {
      heroImage1: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
      heroImage2: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=400&fit=crop',
      badge: '',
      emoji: '',
      pattern: 'gradient',
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
      display: "'Inter', sans-serif",
    },
    styles: {
      borderRadius: '16px',
      buttonStyle: 'rounded',
      shadowStyle: 'soft',
      cardStyle: 'elevated',
    },
    showAllProducts: true,
  },
  
  anime: {
    id: 'anime',
    name: 'anime',
    displayName: 'Anime',
    description: 'Vibrant and energetic anime-inspired designs',
    colors: {
      primary: '#FF1493',      // Hot Pink
      secondary: '#00BFFF',    // Electric Blue
      accent: '#FF6347',       // Orange Red
      background: '#FFF5F8',   // Light pink background
      text: '#1A1A2E',         // Dark text
      textSecondary: '#6B6B8C',
      border: '#FF69B4',       // Pink border
      success: '#7CB342',
      error: '#E53935',
      warning: '#FFA726',
    },
    fonts: {
      heading: "'Bangers', 'Comic Sans MS', cursive",
      body: "'Poppins', sans-serif",
      display: "'Permanent Marker', cursive",
    },
    styles: {
      borderRadius: '16px',
      buttonStyle: 'sharp',
      shadowStyle: 'hard',
      cardStyle: 'elevated',
    },
    images: {
      heroImage1: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop', // Colorful anime-style art
      heroImage2: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=400&fit=crop', // Manga books
      badge: '⚡',
      emoji: '🎌',
      pattern: 'dots',
    },
    showAllProducts: false,
  },
  
  motivation: {
    id: 'motivation',
    name: 'motivation',
    displayName: 'Daily Motivation',
    description: 'Uplifting and inspiring designs to start your day',
    colors: {
      primary: '#FF8C42',      // Sunrise Orange
      secondary: '#4A90E2',    // Sky Blue
      accent: '#FFD700',       // Golden Yellow
      background: '#FFFEF7',   // Warm white
      text: '#2C3E50',
      textSecondary: '#7F8C8D',
      border: '#FFB84D',
      success: '#7CB342',
      error: '#E53935',
      warning: '#FFA726',
    },
    images: {
      heroImage1: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=400&h=400&fit=crop', // Sunrise/motivation
      heroImage2: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=400&h=400&fit=crop', // Inspirational workspace
      badge: '💪',
      emoji: '🌅',
      pattern: 'waves',
    },
    fonts: {
      heading: "'Montserrat', sans-serif",
      body: "'Open Sans', sans-serif",
      display: "'Bebas Neue', cursive",
    },
    styles: {
      borderRadius: '12px',
      buttonStyle: 'rounded',
      shadowStyle: 'soft',
      cardStyle: 'elevated',
    },
    showAllProducts: false,
  },
  
  aesthetic: {
    id: 'aesthetic',
    name: 'aesthetic',
    displayName: 'Aesthetic',
    description: 'Soft, dreamy, and elegant minimalist designs',
    colors: {
      primary: '#FFB6C1',      // Light Pink
      secondary: '#E6E6FA',    // Lavender
      accent: '#FFDAB9',       // Peach
      background: '#FFFFFF',   // Pure white
      text: '#4A4A4A',
      textSecondary: '#9E9E9E',
      border: '#F0E5E5',
      success: '#A5D6A7',
      error: '#EF9A9A',
      warning: '#FFE082',
    },
    images: {
      heroImage1: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop', // Aesthetic art
      heroImage2: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=400&fit=crop', // Minimalist decor
      badge: '✨',
      emoji: '🌸',
      pattern: 'soft-gradient',
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Inter', sans-serif",
      display: "'Cormorant Garamond', serif",
    },
    styles: {
      borderRadius: '24px',
      buttonStyle: 'pill',
      shadowStyle: 'soft',
      cardStyle: 'flat',
    },
    showAllProducts: false,
  },
  
  valentine: {
    id: 'valentine',
    name: 'valentine',
    displayName: 'Valentine',
    description: 'Romantic and sweet love-themed designs',
    colors: {
      primary: '#FF69B4',      // Hot Pink
      secondary: '#DC143C',    // Crimson
      accent: '#FFB6C1',       // Light Pink
      background: '#FFF0F5',   // Lavender Blush
      text: '#8B0000',         // Dark Red
      textSecondary: '#C71585',
      border: '#FFB6D9',
      success: '#FF1493',
      error: '#8B0000',
      warning: '#FF69B4',
    },
    images: {
      heroImage1: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop', // Red roses
      heroImage2: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop', // Heart decorations
      badge: '💕',
      emoji: '💝',
      pattern: 'hearts',
    },
    fonts: {
      heading: "'Dancing Script', cursive",
      body: "'Quicksand', sans-serif",
      display: "'Great Vibes', cursive",
    },
    styles: {
      borderRadius: '20px',
      buttonStyle: 'pill',
      shadowStyle: 'soft',
      cardStyle: 'elevated',
    },
    showAllProducts: false,
  },
}

export const DEFAULT_THEME = 'all'

export const THEME_NAMES = Object.keys(THEMES) as Array<keyof typeof THEMES>

export function getThemeConfig(themeName: string) {
  return THEMES[themeName] || THEMES[DEFAULT_THEME]
}

// Filter products by theme
export function filterProductsByTheme(products: any[], themeName: ThemeName): any[] {
  const theme = getThemeConfig(themeName)
  
  // If theme shows all products, return everything
  if (theme.showAllProducts) {
    return products
  }
  
  // Otherwise filter by theme tags (support both camelCase and snake_case)
  return products.filter(product => {
    const tags = product.theme_tags || product.themeTags || []
    return tags.includes(themeName)
  })
}
