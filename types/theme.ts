// Theme type definitions
export type ThemeName = 'all' | 'anime' | 'motivation' | 'aesthetic' | 'valentine'

export interface Theme {
  id: string
  name: ThemeName
  displayName: string
  description: string
  colors: ThemeColors
  fonts: ThemeFonts
  styles: ThemeStyles
  images: ThemeImages
  showAllProducts: boolean
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  textSecondary: string
  border: string
  success: string
  error: string
  warning: string
}

export interface ThemeFonts {
  heading: string
  body: string
  display: string
}

export interface ThemeStyles {
  borderRadius: string
  buttonStyle: 'rounded' | 'sharp' | 'pill'
  shadowStyle: 'soft' | 'hard' | 'none'
  cardStyle: 'flat' | 'elevated' | 'outlined'
}

export interface ThemeImages {
  heroImage1: string
  heroImage2: string
  badge: string
  emoji: string
  pattern: string
}
