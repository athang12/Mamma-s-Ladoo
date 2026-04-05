import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-12 md:mt-20 safe-bottom">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl md:text-2xl font-display font-bold mb-3 md:mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Acrylic & Decor
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              Creating beautiful custom products for your space
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base tap-highlight-transparent">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base tap-highlight-transparent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base tap-highlight-transparent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base tap-highlight-transparent">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base tap-highlight-transparent">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base tap-highlight-transparent">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Follow Us</h4>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-pink-400 transition-colors p-2 tap-highlight-transparent"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-pink-400 transition-colors p-2 tap-highlight-transparent"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-pink-400 transition-colors p-2 tap-highlight-transparent"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-pink-400 transition-colors p-2 tap-highlight-transparent"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400">
          <p className="text-xs md:text-sm">&copy; 2026 Acrylic & Decor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
