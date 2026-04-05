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
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3 md:mb-4">
            Best Sellers
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3 md:mb-4">
          Best Sellers
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg">
          Most loved ladoos and snacks from our kitchen
        </p>
      </div>

      {featuredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Best sellers are being prepared.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Please check again in a little while.
          </p>
        </div>
      )}
    </section>
  )
}
