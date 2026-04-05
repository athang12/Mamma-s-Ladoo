'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-orange-200/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-10 w-60 h-60 rounded-full bg-amber-300/30 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="space-y-5 sm:space-y-6 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mx-auto md:mx-0 bg-orange-100 text-orange-700 border border-orange-200">
              <span className="text-base">👩‍🍳</span>
              <span>Freshly made every day</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Handmade{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Ladoos & Snacks
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-700">
              Welcome to Mamma&apos;s Ladoo. Enjoy traditional sweets and savory snacks prepared with
              home-style taste, quality ingredients, and quick delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link href="/products" className="btn-primary inline-flex items-center justify-center text-sm sm:text-base tap-highlight-transparent">
                Order Now
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="/about" className="btn-secondary inline-flex items-center justify-center text-sm sm:text-base tap-highlight-transparent">
                Our Story
              </Link>
            </div>
          </div>

          <div className="relative mt-8 md:mt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="card transform hover:scale-105 transition-transform border-2 border-orange-200">
                <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
                  <img
                    src="/images/Gond.jpg"
                    alt="Fresh ladoos"
                    className="absolute inset-0 w-full h-full object-cover object-center scale-[1.28]"
                    loading="eager"
                  />
                </div>
                <div className="absolute top-2 right-2 text-3xl">🥮</div>
              </div>
              <div className="card transform hover:scale-105 transition-transform mt-4 sm:mt-6 md:mt-8 border-2 border-amber-200">
                <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
                  <img
                    src="/images/Oats_Makhana.jpg"
                    alt="Indian snacks platter"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </div>
                <div className="absolute top-2 right-2 text-3xl">🍘</div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none bg-orange-300" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 md:w-32 md:h-32 rounded-full blur-3xl opacity-50 animate-pulse delay-1000 pointer-events-none bg-red-200" />
          </div>
        </div>
      </div>
    </section>
  )
}
