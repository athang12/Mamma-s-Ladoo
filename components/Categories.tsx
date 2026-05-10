'use client'

import Link from 'next/link'
import { categories } from '@/lib/data'
import { ArrowRight } from 'lucide-react'

export default function Categories() {
  return (
    <section className="py-10 sm:py-14 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green-pale text-brand-green text-xs sm:text-sm font-semibold mb-3 tracking-wide uppercase">
            Categories
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-md mx-auto">
            Pick your favorite ladoos and snacks
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group cursor-pointer tap-highlight-transparent relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
            >
              <div className="relative overflow-hidden h-44 sm:h-52 md:h-64">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/85 via-brand-green-dark/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-0.5">
                    {category.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-green-100 line-clamp-1">
                    {category.description}
                  </p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
