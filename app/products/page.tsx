'use client'

import { categories } from '@/lib/data'
import ProductCard from '@/components/ProductCard'
import { useState, useEffect } from 'react'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { getProducts, getProductsByCategory } from '@/lib/supabase/api'
import type { Product } from '@/lib/supabase/types'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = selectedCategory === 'all' 
          ? await getProducts()
          : await getProductsByCategory(selectedCategory.toUpperCase())
        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [selectedCategory])

  const filteredProducts = products

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price)
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price)
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    // Featured first
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  return (
    <div className="bg-gradient-to-b from-green-50/30 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green-pale text-brand-green text-xs sm:text-sm font-semibold mb-3 tracking-wide uppercase">
            Our Collection
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3">
            Shop Ladoos & Snacks
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Fresh handcrafted sweets and namkeen for every craving.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 shadow-sm border border-green-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Filter className="w-4 h-4 text-brand-green" />
                <span>Filter:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 border-2 border-green-100 rounded-xl focus:border-brand-green outline-none text-sm transition-colors bg-green-50/50"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <SlidersHorizontal className="w-4 h-4 text-brand-green" />
                <span>Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 border-2 border-green-100 rounded-xl focus:border-brand-green outline-none text-sm transition-colors bg-green-50/50"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-green-50 rounded-2xl h-80 sm:h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 text-lg font-medium">No products found in this category.</p>
            <p className="text-gray-400 text-sm mt-1">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
