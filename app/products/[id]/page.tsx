'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { getProductById } from '@/lib/supabase/api'
import type { Product } from '@/lib/supabase/types'
import { ShoppingCart, Heart, ArrowLeft, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { productColors } from '@/lib/data'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  
  const productId = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState<string>('white')
  const [quantity, setQuantity] = useState(1)
  const [liked, setLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (!product || product.images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [product])

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return
      
      setLoading(true)
      try {
        const data = await getProductById(productId)
        if (data) {
          setProduct(data)
          setSelectedColor(data.default_color || 'white')
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    
    addItem({
      productId: product.id,
      product: {
        name: product.name,
        thumbnailUrl: product.images[0],
        basePrice: Number(product.price),
      },
      quantity,
      selectedColor: selectedColor,
    })
    
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products" className="btn-primary inline-block">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => router.push('/products')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Products</span>
      </button>

      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-pink-500">Home</Link>
        {' / '}
        <Link href="/products" className="hover:text-pink-500">Products</Link>
        {' / '}
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="card overflow-hidden mb-4 relative group">
            <img
              src={product.images[currentImageIndex] || product.images[0]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover"
            />
            
            {/* Image Navigation - Only show if multiple images */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === 0 ? product.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    (prev + 1) % product.images.length
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Navigation */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-1 card overflow-hidden transition-all ${
                    idx === currentImageIndex 
                      ? 'ring-2 ring-pink-500 ring-offset-2' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-display font-bold mb-4">{product.name}</h1>

          <div className="text-4xl font-bold text-pink-600 mb-6">
            ₹{Number(product.price).toFixed(2)}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          {product.available_colors && product.available_colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">
                Color: <span className="capitalize font-normal">{selectedColor}</span>
              </h3>
              <div className="flex gap-3">
                {product.available_colors.map((colorKey) => {
                  const color = productColors[colorKey as keyof typeof productColors]
                  if (!color) return null
                  return (
                    <button
                      key={colorKey}
                      onClick={() => setSelectedColor(colorKey)}
                      className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                        selectedColor === colorKey
                          ? 'border-pink-500 ring-4 ring-pink-200'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  )
                })}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block font-semibold mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
              >
                +
              </button>
              <span className="text-gray-600 text-sm">({product.stock} available)</span>
            </div>
          </div>

          <div className="flex space-x-4 mb-8">
            {product.customizable ? (
              <Link
                href={`/customize/${product.id}`}
                className="btn-primary flex-1 text-center"
              >
                Customize & Add to Cart
              </Link>
            ) : (
              <button 
                onClick={handleAddToCart} 
                disabled={product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            )}
            <button 
              onClick={() => setLiked(!liked)}
              className="btn-secondary w-14 flex items-center justify-center"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-pink-50 rounded-xl">
              <Truck className="w-6 h-6 mx-auto mb-2 text-pink-600" />
              <p className="text-sm font-semibold">Free Shipping</p>
              <p className="text-xs text-gray-600">On orders $50+</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Shield className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold">Quality Guarantee</p>
              <p className="text-xs text-gray-600">Premium materials</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <RefreshCw className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-semibold">Easy Returns</p>
              <p className="text-xs text-gray-600">30-day policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
