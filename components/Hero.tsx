'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, Award, Truck } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-amber-50/40 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-green-200/25 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-10 sm:py-14 md:py-20 lg:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-5 sm:space-y-6 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mx-auto md:mx-0 bg-brand-green-pale text-brand-green border border-green-200">
              <Leaf className="w-4 h-4" />
              <span>Freshly made every day</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight tracking-tight">
              Handmade{' '}
              <span className="bg-gradient-to-r from-brand-green to-emerald-500 bg-clip-text text-transparent">
                Ladoos
              </span>
              {' '}&amp;{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-brand-green-light bg-clip-text text-transparent">
                Snacks
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Enjoy traditional sweets and savory snacks prepared with
              home-style taste, quality ingredients, and quick delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link href="/products" className="btn-primary inline-flex items-center justify-center text-sm sm:text-base tap-highlight-transparent group">
                Order Now
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="btn-secondary inline-flex items-center justify-center text-sm sm:text-base tap-highlight-transparent">
                Our Story
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-brand-green-pale flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-brand-green" />
                </div>
                <span className="font-medium">100% Natural</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-brand-green-pale flex items-center justify-center">
                  <Award className="w-4 h-4 text-brand-green" />
                </div>
                <span className="font-medium">No Preservatives</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-brand-green-pale flex items-center justify-center">
                  <Truck className="w-4 h-4 text-brand-green" />
                </div>
                <span className="font-medium">Fast Delivery</span>
              </div>
            </div>
          </div>

          <div className="relative mt-4 md:mt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-500 border-2 border-brand-green-pale">
                <div className="relative h-44 sm:h-52 md:h-60 lg:h-72">
                  <img
                    src="/images/Gond.jpg"
                    alt="Fresh ladoos"
                    className="absolute inset-0 w-full h-full object-cover object-center scale-[1.28]"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-green">
                  🥮 Gond Ladoo
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-500 mt-6 sm:mt-8 border-2 border-brand-green-pale">
                <div className="relative h-44 sm:h-52 md:h-60 lg:h-72">
                  <img
                    src="/images/Oats_Makhana.jpg"
                    alt="Indian snacks platter"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-green">
                  🍘 Oats Makhana
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-300/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 md:w-32 md:h-32 rounded-full bg-green-200/40 blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Scrolling USP strip — like eatanytime.in */}
      <div className="bg-brand-green-pale border-y border-green-200 overflow-hidden">
        <div className="animate-marquee inline-flex items-center py-3 whitespace-nowrap">
          {[
            '🍃 100% NATURAL',
            '🚫 NO PRESERVATIVES',
            '🏠 HOMEMADE TASTE',
            '📦 FRESH PACKAGING',
            '🍃 100% NATURAL',
            '🚫 NO PRESERVATIVES',
            '🏠 HOMEMADE TASTE',
            '📦 FRESH PACKAGING',
          ].map((text, i) => (
            <span key={i} className="mx-6 sm:mx-10 text-sm sm:text-base font-bold text-brand-green tracking-wide">
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
