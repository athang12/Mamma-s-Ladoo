'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import { productColors } from '@/lib/data'
import type { Product } from '@/lib/supabase/types'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [liked, setLiked] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product.default_color || 'white')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
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
      selectedColor: selectedColor,
    })
  }

  const getCategoryDisplay = (cat: string) => {
    const mapping: Record<string, string> = {
      COFFEE_MUGS: 'Mug',
      JIGSAW_PUZZLES: 'Puzzle',
      HANDKERCHIEFS: 'Handkerchief',
      TOTE_BAGS: 'Tote Bag',
      DAILY_PLANNERS: 'Planner',
      ACRYLIC_STANDS: 'Acrylic Stand',
      WALL_FRAMES: 'Frame',
      FRIDGE_MAGNETS: 'Magnet',
    }
    return mapping[cat] || cat
  }

  // Use new canvas-based customizer for customizable products
  const productLink = product.customizable 
    ? `/customize-new/${product.id}` 
    : `/products/${product.id}`

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
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
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

          {product.customizable && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 mt-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Custom</span>
            </div>
          )}
          
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
          <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {/* Color Selector */}
          {product.available_colors && product.available_colors.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1.5">
                Color: <span className="capitalize font-medium">{selectedColor}</span>
              </p>
              <div className="flex gap-1.5">
                {product.available_colors.map((colorKey) => {
                  const color = productColors[colorKey as keyof typeof productColors]
                  if (!color) return null
                  return (
                    <button
                      key={colorKey}
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedColor(colorKey)
                      }}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                        selectedColor === colorKey
                          ? 'border-pink-500 ring-2 ring-pink-200'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                    />
                  )
                })}
              </div>
            </div>
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
