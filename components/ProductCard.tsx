'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import type { Product } from '@/lib/supabase/types'
import { parseIngredientList } from '@/lib/utils/descriptionFormat'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [liked, setLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [justAdded, setJustAdded] = useState(false)
  const ingredientItems = parseIngredientList(product.description)
  
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
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
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
      LADOOS_DRYFRUIT: 'Dry Fruit Ladoo',
      LIGHT_SWEETS: 'Light Sweet',
    }
    return mapping[cat] || cat
  }

  const productLink = `/products/${product.id}`

  return (
    <div className="group h-full flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100/60">
      <Link href={productLink} className="flex-1 flex flex-col">
        <div className="relative overflow-hidden h-44 sm:h-52 md:h-60 bg-green-50">
          <img
            src={product.images[currentImageIndex] || product.images[0]}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Image Navigation Arrows */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-gray-800" />
              </button>
              
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(idx)
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex 
                        ? 'bg-white w-5' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Badges - stacked vertically */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
            <div className="bg-brand-green text-white px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-sm w-fit">
              {getCategoryDisplay(product.category)}
            </div>
            {product.featured && (
              <div className="flex items-center gap-1 bg-amber-400 text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm w-fit">
                <Star className="w-3 h-3 fill-current" />
                BEST SELLER
              </div>
            )}
          </div>

          {/* Like button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setLiked(!liked)
            }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all tap-highlight-transparent"
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
        </div>

        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>

          {ingredientItems.length > 0 ? (
            <ul className="text-gray-500 text-[11px] sm:text-xs mb-3 space-y-0.5 flex-1">
              {ingredientItems.slice(0, 3).map((item, index) => (
                <li key={index} className="leading-snug">• {item}</li>
              ))}
              {ingredientItems.length > 3 && (
                <li className="text-[10px] sm:text-[11px] text-gray-400">
                  +{ingredientItems.length - 3} more ingredients
                </li>
              )}
            </ul>
          ) : (
            <p className="text-gray-500 text-[11px] sm:text-xs mb-3 line-clamp-2 flex-1">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-green-50">
            <span className="text-lg sm:text-xl font-bold text-brand-green">
              ₹{Number(product.price).toFixed(0)}
            </span>
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all tap-highlight-transparent ${
                justAdded
                  ? 'bg-brand-green text-white'
                  : 'bg-brand-green-pale text-brand-green hover:bg-brand-green hover:text-white'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{justAdded ? 'Added!' : 'Add'}</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
