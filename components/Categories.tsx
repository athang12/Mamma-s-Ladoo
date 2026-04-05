'use client'

import Link from 'next/link'
import { categories } from '@/lib/data'
import { ArrowRight } from 'lucide-react'

export default function Categories() {
  return (
    <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <div className="text-5xl mb-3">🍥</div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3 md:mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg">
          Pick your favorite ladoos and snacks
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="card group cursor-pointer tap-highlight-transparent relative border border-orange-100"
          >
            <div className="relative overflow-hidden h-52 sm:h-56 md:h-64">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-semibold text-orange-700">
                  Explore
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
