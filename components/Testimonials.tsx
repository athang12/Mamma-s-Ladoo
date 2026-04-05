'use client'

import { Star } from 'lucide-react'
import { useThemeStore } from '@/lib/store'
import { getThemeConfig } from '@/lib/constants'

const testimonials = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely love my custom acrylic stand! The quality is outstanding and it looks perfect on my desk.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    name: 'Michael Chen',
    rating: 5,
    comment: 'The wall frames are stunning! They really make my artwork pop. Highly recommend!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    name: 'Emily Rodriguez',
    rating: 5,
    comment: 'Great customer service and beautiful products. The fridge magnets are adorable!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
]

export default function Testimonials() {
  const currentTheme = useThemeStore((state) => state.currentTheme)
  const theme = getThemeConfig(currentTheme)

  return (
    <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <div className="text-5xl mb-3">{theme.images.emoji}</div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3 md:mb-4">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg">
          Join thousands of happy customers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="card p-4 sm:p-5 md:p-6 relative"
            style={{
              borderColor: currentTheme === 'anime' ? theme.colors.primary : 'transparent',
              borderWidth: currentTheme === 'anime' ? '2px' : '0px'
            }}
          >
            <div className="absolute top-2 right-2 text-2xl">{theme.images.badge}</div>
            <div className="flex items-center mb-3 sm:mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4"
                loading="lazy"
                style={{
                  border: `2px solid ${theme.colors.primary}`
                }}
              />
              <div>
                <h4 className="font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-3 h-3 sm:w-4 sm:h-4 fill-current" 
                      style={{ color: theme.colors.accent }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
              {testimonial.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
