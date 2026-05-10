'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useState, useEffect } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  return (
    <>
      {/* Scrolling Promo Banner */}
      <div className="bg-brand-green text-white overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-flex items-center py-2 text-xs sm:text-sm font-medium">
          <span className="mx-8">🎉 Free Delivery on orders above ₹500</span>
          <span className="mx-8">🍃 100% Natural Ingredients</span>
          <span className="mx-8">⭐ Freshly Made & Packed Daily</span>
          <span className="mx-8">🎁 Festival Gift Boxes Available</span>
          <span className="mx-8">🎉 Free Delivery on orders above ₹500</span>
          <span className="mx-8">🍃 100% Natural Ingredients</span>
          <span className="mx-8">⭐ Freshly Made & Packed Daily</span>
          <span className="mx-8">🎁 Festival Gift Boxes Available</span>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 safe-top ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
      }`}>
        <nav className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 tap-highlight-transparent"
            >
              <Image
                src="/images/logo.png"
                alt="Mamma's Ladoo logo"
                width={44}
                height={44}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-brand-green-pale"
                priority
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl font-display font-bold text-brand-green">
                  Mamma&apos;s Ladoo
                </span>
                <span className="text-[10px] sm:text-xs text-brand-green-light font-medium -mt-1 hidden sm:block">
                  Fresh &amp; Homemade
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Shop' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-full text-gray-700 hover:text-brand-green hover:bg-brand-green-pale/50 transition-all font-medium text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-1 md:space-x-2">
              {/* Cart Icon */}
              <Link href="/cart" className="relative p-2.5 rounded-full hover:bg-brand-green-pale/50 transition-colors tap-highlight-transparent">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-green text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2.5 rounded-full hover:bg-brand-green-pale/50 text-gray-700 tap-highlight-transparent transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setMenuOpen(false)}
              />
              <div className="fixed top-[100px] left-0 right-0 bottom-0 bg-white z-50 md:hidden overflow-y-auto safe-bottom">
                <div className="flex flex-col p-6 space-y-1">
                  {[
                    { href: '/', label: 'Home', icon: '🏠' },
                    { href: '/products', label: 'Shop', icon: '🛍️' },
                    { href: '/about', label: 'About', icon: '📖' },
                    { href: '/contact', label: 'Contact', icon: '📧' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 text-lg font-semibold text-gray-800 hover:text-brand-green hover:bg-brand-green-pale/30 transition-all py-4 px-4 rounded-xl tap-highlight-transparent"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </nav>
      </header>
    </>
  )
}
