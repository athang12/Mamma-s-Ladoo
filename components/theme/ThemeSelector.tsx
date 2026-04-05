'use client'

import { useThemeStore } from '@/lib/store'
import { THEMES } from '@/lib/constants'
import { ThemeName } from '@/types/theme'
import { Palette } from 'lucide-react'
import { useState } from 'react'

const THEME_ORDER: ThemeName[] = ['all', 'anime', 'motivation', 'aesthetic', 'valentine']

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
        aria-label="Select Theme"
      >
        <Palette className="w-5 h-5" />
        <span className="hidden sm:inline font-medium capitalize">
          {THEMES[currentTheme]?.displayName || 'Theme'}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme Dropdown */}
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg">Choose Theme</h3>
              <p className="text-sm text-gray-600">Each theme filters products</p>
            </div>
            
            <div className="p-2 max-h-96 overflow-y-auto">
              {THEME_ORDER.map((themeName) => {
                const theme = THEMES[themeName]
                const isActive = currentTheme === themeName
                
                return (
                  <button
                    key={themeName}
                    onClick={() => {
                      setTheme(themeName as ThemeName)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left p-4 rounded-xl mb-2 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-400'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{theme.images.emoji}</span>
                        <span className="font-bold">{theme.displayName}</span>
                      </div>
                      {isActive && (
                        <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{theme.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full shadow-md"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full shadow-md"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full shadow-md"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                      <span className="text-xs text-gray-500 ml-auto">
                        {themeName === 'all' ? 'All products' : `${theme.displayName} only`}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
