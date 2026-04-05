import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ThemeName } from '@/types/theme'
import { THEMES, DEFAULT_THEME } from '@/lib/constants/themes'

interface ThemeStore {
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
  getThemeConfig: () => typeof THEMES[ThemeName]
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: DEFAULT_THEME as ThemeName,
      
      setTheme: (theme: ThemeName) => {
        set({ currentTheme: theme })
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme)
        }
      },
      
      getThemeConfig: () => {
        const theme = get().currentTheme
        return THEMES[theme]
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)
