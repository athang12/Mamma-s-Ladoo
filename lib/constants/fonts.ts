// 20 Creative Google Fonts for text customization
export const CREATIVE_FONTS = [
  // Handwritten & Script
  { name: 'Pacifico', style: 'handwritten', category: 'display' },
  { name: 'Dancing Script', style: 'handwritten', category: 'handwriting' },
  { name: 'Satisfy', style: 'handwritten', category: 'handwriting' },
  { name: 'Great Vibes', style: 'elegant', category: 'handwriting' },
  
  // Bold & Strong
  { name: 'Bebas Neue', style: 'bold', category: 'display' },
  { name: 'Anton', style: 'bold', category: 'sans-serif' },
  { name: 'Bangers', style: 'bold', category: 'display' },
  { name: 'Righteous', style: 'bold', category: 'display' },
  
  // Elegant & Serif
  { name: 'Playfair Display', style: 'elegant', category: 'serif' },
  { name: 'Cormorant Garamond', style: 'elegant', category: 'serif' },
  { name: 'Cinzel', style: 'elegant', category: 'serif' },
  
  // Modern & Clean
  { name: 'Poppins', style: 'modern', category: 'sans-serif' },
  { name: 'Raleway', style: 'modern', category: 'sans-serif' },
  { name: 'Montserrat', style: 'modern', category: 'sans-serif' },
  
  // Decorative & Fun
  { name: 'Lobster', style: 'decorative', category: 'display' },
  { name: 'Permanent Marker', style: 'decorative', category: 'handwriting' },
  { name: 'Fredoka One', style: 'decorative', category: 'display' },
  { name: 'Audiowide', style: 'decorative', category: 'display' },
  { name: 'Bungee', style: 'decorative', category: 'display' },
  { name: 'Monoton', style: 'decorative', category: 'display' },
] as const

export type FontName = typeof CREATIVE_FONTS[number]['name']

// Generate Google Fonts URL for loading
export function getGoogleFontsURL(): string {
  const families = CREATIVE_FONTS.map(font => 
    `family=${font.name.replace(/ /g, '+')}:wght@400;700`
  ).join('&')
  
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

// Group fonts by style for UI
export function getFontsByStyle() {
  const grouped: Record<string, typeof CREATIVE_FONTS[number][]> = {}
  
  CREATIVE_FONTS.forEach(font => {
    if (!grouped[font.style]) {
      grouped[font.style] = []
    }
    grouped[font.style].push(font)
  })
  
  return grouped
}
