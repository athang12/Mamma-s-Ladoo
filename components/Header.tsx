'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useState, useEffect } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  // Prevent hydration mismatch by only showing cart count after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route change
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm safe-top">
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
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-orange-200"
              priority
            />
            <span className="text-lg sm:text-xl md:text-2xl font-display font-bold text-orange-700">
              Mamma&apos;s Ladoo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Shop
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 tap-highlight-transparent">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-pink-500 transition-colors" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 tap-highlight-transparent"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <div className="fixed top-[60px] left-0 right-0 bottom-0 bg-white z-50 md:hidden overflow-y-auto safe-bottom">
              <div className="flex flex-col p-6 space-y-4">
                <Link
                  href="/"
                  className="text-lg font-semibold text-gray-800 hover:text-pink-500 transition-colors py-3 border-b tap-highlight-transparent"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-lg font-semibold text-gray-800 hover:text-pink-500 transition-colors py-3 border-b tap-highlight-transparent"
                  onClick={() => setMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-semibold text-gray-800 hover:text-pink-500 transition-colors py-3 border-b tap-highlight-transparent"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-lg font-semibold text-gray-800 hover:text-pink-500 transition-colors py-3 border-b tap-highlight-transparent"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
