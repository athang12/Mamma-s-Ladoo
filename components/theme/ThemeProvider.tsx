'use client'

import { useThemeStore } from '@/lib/store'
import { useEffect } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme, getThemeConfig } = useThemeStore()
  
  useEffect(() => {
    const theme = getThemeConfig()
    
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', currentTheme)
    
    // Apply CSS custom properties
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.colors.primary)
    root.style.setProperty('--color-secondary', theme.colors.secondary)
    root.style.setProperty('--color-accent', theme.colors.accent)
    root.style.setProperty('--color-background', theme.colors.background)
    root.style.setProperty('--color-text', theme.colors.text)
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary)
    root.style.setProperty('--color-border', theme.colors.border)
    
    root.style.setProperty('--font-heading', theme.fonts.heading)
    root.style.setProperty('--font-body', theme.fonts.body)
    root.style.setProperty('--font-display', theme.fonts.display)
    
    root.style.setProperty('--border-radius', theme.styles.borderRadius)
  }, [currentTheme, getThemeConfig])
  
  return <>{children}</>
}
