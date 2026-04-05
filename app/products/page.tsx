'use client'

import { categories } from '@/lib/data'
import ProductCard from '@/components/ProductCard'
import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
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
    <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3 sm:mb-4">Shop Ladoos & Snacks</h1>
        <p className="text-gray-600">
          Fresh handcrafted sweets and namkeen for every craving.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold">Filter by:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 outline-none"
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
            <span className="font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 outline-none"
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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}
