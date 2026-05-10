import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-green-dark text-white mt-0 safe-bottom">
      {/* Newsletter strip */}
      <div className="bg-brand-green">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-display font-bold">Stay Updated!</h3>
              <p className="text-green-100 text-xs sm:text-sm">Get offers and new product alerts</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-full text-sm text-gray-900 outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-5 py-2.5 bg-white text-brand-green rounded-full text-sm font-semibold hover:bg-green-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl md:text-2xl font-display font-bold mb-3 md:mb-4 text-white">
              Mamma&apos;s Ladoo
            </h3>
            <p className="text-green-200 text-sm md:text-base mb-4">
              Fresh homemade ladoos and snacks for every occasion
            </p>
            <div className="flex justify-center sm:justify-start space-x-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors tap-highlight-transparent" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors tap-highlight-transparent" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors tap-highlight-transparent" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors tap-highlight-transparent" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold mb-3 md:mb-4 text-green-200 uppercase tracking-wider">Pages</h4>
            <ul className="space-y-2.5">
              <li><Link href="/products" className="text-green-100 hover:text-white transition-colors text-sm tap-highlight-transparent">Shop</Link></li>
              <li><Link href="/about" className="text-green-100 hover:text-white transition-colors text-sm tap-highlight-transparent">About Us</Link></li>
              <li><Link href="/contact" className="text-green-100 hover:text-white transition-colors text-sm tap-highlight-transparent">Contact</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold mb-3 md:mb-4 text-green-200 uppercase tracking-wider">Info</h4>
            <ul className="space-y-2.5">
              <li><Link href="/shipping" className="text-green-100 hover:text-white transition-colors text-sm tap-highlight-transparent">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-green-100 hover:text-white transition-colors text-sm tap-highlight-transparent">Returns &amp; Refund</Link></li>
              <li><Link href="/faq" className="text-green-100 hover:text-white transition-colors text-sm tap-highlight-transparent">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold mb-3 md:mb-4 text-green-200 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <Phone className="w-4 h-4 mt-0.5 text-green-300 flex-shrink-0" />
                <span className="text-green-100 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <Mail className="w-4 h-4 mt-0.5 text-green-300 flex-shrink-0" />
                <span className="text-green-100 text-sm">hello@mammasladoo.com</span>
              </li>
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <MapPin className="w-4 h-4 mt-0.5 text-green-300 flex-shrink-0" />
                <span className="text-green-100 text-sm">Mumbai, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-6 text-center">
          <p className="text-xs text-green-300">&copy; 2026 Mamma&apos;s Ladoo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
