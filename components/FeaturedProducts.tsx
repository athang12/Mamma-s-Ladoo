'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { getFeaturedProducts } from '@/lib/supabase/api'
import type { Product } from '@/lib/supabase/types'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true)
      try {
        const data = await getFeaturedProducts()
        setProducts(data)
      } catch (error) {
        console.error('Error loading featured products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadFeaturedProducts()
  }, [])
  
  const featuredProducts = products

  if (loading) {
    return (
      <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-white to-green-50/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green-pale text-brand-green text-xs sm:text-sm font-semibold mb-3 tracking-wide uppercase">
              Best Sellers
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
              Most Loved Items
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-green-50 rounded-2xl h-80 sm:h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-white to-green-50/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green-pale text-brand-green text-xs sm:text-sm font-semibold mb-3 tracking-wide uppercase">
            Best Sellers
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3">
            Most Loved Items
          </h2>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-md mx-auto">
            Most loved ladoos and snacks from our kitchen
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="text-4xl mb-3">🍬</div>
            <p className="text-gray-500 text-lg font-medium">
              Best sellers are being prepared.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
