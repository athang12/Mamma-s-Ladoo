'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import type { Product } from '@/lib/supabase/types'
import { parseIngredientList } from '@/lib/utils/descriptionFormat'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [liked, setLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const ingredientItems = parseIngredientList(product.description)
  
  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (product.images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [product.images.length])
  
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      productId: product.id,
      product: {
        name: product.name,
        thumbnailUrl: product.images[0],
        basePrice: Number(product.price),
      },
      quantity: 1,
      selectedColor: 'standard',
    })
  }

  const getCategoryDisplay = (cat: string) => {
    const mapping: Record<string, string> = {
      COFFEE_MUGS: 'Mug',
      JIGSAW_PUZZLES: 'Puzzle',
      HANDKERCHIEFS: 'Handkerchief',
      TOTE_BAGS: 'Tote Bag',
      DAILY_PLANNERS: 'Planner',
      ACRYLIC_STANDS: 'Ladoo',
      WALL_FRAMES: 'Snack Box',
      FRIDGE_MAGNETS: 'Namkeen',
      LADOOS: 'Ladoo',
      SNACKS: 'Snack',
      DRY_SNACKS: 'Dry Snack',
      GIFT_BOXES: 'Gift Box',
    }
    return mapping[cat] || cat
  }

  const productLink = `/products/${product.id}`

  return (
    <div className="card group h-full flex flex-col">
      <Link href={productLink} className="flex-1 flex flex-col">
        <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
          <img
            src={product.images[currentImageIndex] || product.images[0]}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Image Navigation Arrows - Only show if multiple images */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(idx)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Product Type Badge */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
              {getCategoryDisplay(product.category)}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()
              setLiked(!liked)
            }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all tap-highlight-transparent"
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${liked ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`}
            />
          </button>
        </div>

        <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
          <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-1">
            {product.name}
          </h3>

          {ingredientItems.length > 0 ? (
            <ul className="text-gray-600 text-xs sm:text-sm mb-3 space-y-1">
              {ingredientItems.slice(0, 3).map((item, index) => (
                <li key={index} className="leading-snug">• {item}</li>
              ))}
              {ingredientItems.length > 3 && (
                <li className="text-[11px] sm:text-xs text-gray-500">
                  +{ingredientItems.length - 3} more ingredients
                </li>
              )}
            </ul>
          ) : (
            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ₹{Number(product.price).toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className="btn-primary flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 text-sm tap-highlight-transparent"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-semibold">Add</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
