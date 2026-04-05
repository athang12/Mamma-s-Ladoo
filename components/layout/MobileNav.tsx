'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, Info, Mail } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/products', icon: ShoppingBag, label: 'Shop' },
  { href: '/about', icon: Info, label: 'About' },
  { href: '/contact', icon: Mail, label: 'Contact' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full tap-highlight-transparent transition-colors ${
                isActive
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'fill-pink-100' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
