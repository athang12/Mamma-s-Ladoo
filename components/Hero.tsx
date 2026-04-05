'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useThemeStore } from '@/lib/store'
import { getThemeConfig } from '@/lib/constants'

export default function Hero() {
  const currentTheme = useThemeStore((state) => state.currentTheme)
  const theme = getThemeConfig(currentTheme)

  return (
    <section className="relative overflow-hidden">
      {/* Theme-specific background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {theme.images.pattern === 'dots' && (
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        )}
        {theme.images.pattern === 'waves' && (
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${theme.colors.primary}22 0px, transparent 2px, transparent 10px)`,
          }} />
        )}
        {theme.images.pattern === 'hearts' && (
          <div className="text-6xl select-none" style={{ color: theme.colors.primary }}>
            {'💕 '.repeat(50)}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-4 sm:space-y-6 text-center md:text-left">
            <div 
              className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mx-auto md:mx-0"
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              <span className="text-lg">{theme.images.badge}</span>
              <span>Custom Designs Available</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Transform Your Space with{' '}
              <span 
                className="bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`
                }}
              >
                {theme.displayName} Vibes
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              <span className="text-2xl mr-2">{theme.images.emoji}</span>
              Discover unique mugs, puzzles, planners & more. 
              Personalize your decor with our premium quality products.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link href="/products" className="btn-primary inline-flex items-center justify-center text-sm sm:text-base tap-highlight-transparent">
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="/about" className="btn-secondary inline-flex items-center justify-center text-sm sm:text-base tap-highlight-transparent">
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image/Graphics - Theme Specific */}
          <div className="relative mt-8 md:mt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div 
                className="card transform hover:scale-105 transition-transform"
                style={{ 
                  borderColor: theme.colors.primary,
                  borderWidth: '2px'
                }}
              >
                <img
                  src={theme.images.heroImage1}
                  alt={`${theme.displayName} style product`}
                  className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover"
                  loading="eager"
                />
                <div className="absolute top-2 right-2 text-3xl">{theme.images.emoji}</div>
              </div>
              <div 
                className="card transform hover:scale-105 transition-transform mt-4 sm:mt-6 md:mt-8"
                style={{ 
                  borderColor: theme.colors.secondary,
                  borderWidth: '2px'
                }}
              >
                <img
                  src={theme.images.heroImage2}
                  alt={`${theme.displayName} products`}
                  className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover"
                  loading="eager"
                />
                <div className="absolute top-2 right-2 text-3xl">{theme.images.badge}</div>
              </div>
            </div>
            
            {/* Floating Elements - Theme Colors */}
            <div 
              className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full blur-2xl md:blur-3xl opacity-60 animate-pulse pointer-events-none"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div 
              className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full blur-2xl md:blur-3xl opacity-60 animate-pulse delay-1000 pointer-events-none"
              style={{ backgroundColor: theme.colors.secondary }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
