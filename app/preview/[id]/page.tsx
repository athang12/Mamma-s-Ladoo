'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, Edit3 } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useDesignStore } from '@/lib/store/designStore'
import { getProductById } from '@/lib/supabase/api'
import { compressBase64Image } from '@/lib/utils/imageCompression'
import type { Product } from '@/lib/supabase/types'
import Image from 'next/image'

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const { designImageUrl, designData, productId: storedProductId, clearDesign } = useDesignStore()

  const productId = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return
      
      setLoading(true)
      try {
        const data = await getProductById(productId)
        if (data) {
          setProduct(data)
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [productId])

  const handleAddToCart = async () => {
    if (!product || !designImageUrl) return

    setIsAdding(true)
    
    try {
      console.log('Original image size:', designImageUrl.length)
      
      // Compress image to reduce storage size (from ~5.5MB to ~100-200KB)
      const compressedImage = await compressBase64Image(designImageUrl, 600, 0.8)
      console.log('Compressed image size:', compressedImage.length)
      
      addItem({
        productId: product.id,
        product: {
          name: product.name,
          thumbnailUrl: compressedImage,
          basePrice: Number(product.price),
        },
        quantity: 1,
        selectedColor: product.default_color,
        customImageUrl: compressedImage,
        customImageData: {
          designData: designData ? JSON.stringify(designData) : '',
          rotation: 0,
          scale: 1,
          positionX: 0,
          positionY: 0,
          flipHorizontal: false,
          flipVertical: false,
        },
      })

      // Clear design from store after successful add to cart
      clearDesign()

      // Navigate to cart after short delay
      setTimeout(() => {
        router.push('/cart')
      }, 800)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAdding(false)
    }
  }

  const handleEditDesign = () => {
    router.push(`/customize-new/${productId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!product || !designImageUrl) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Preview Not Available</h1>
        <p className="text-gray-600 mb-6">The design could not be loaded.</p>
        <button
          onClick={() => router.push('/products')}
          className="btn-primary"
        >
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/products')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Products</span>
          </button>
          
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Preview Your Design
            </h1>
            <p className="text-gray-600">
              Review your custom {product.name} before adding to cart
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Preview Image */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="aspect-square relative bg-gray-50 rounded-xl overflow-hidden">
              <img
                src={designImageUrl}
                alt="Custom Design Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
              
              {product.description && (
                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>
              )}

              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price</span>
                  <span className="text-3xl font-bold text-purple-600">₹{product.price}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleEditDesign}
                  disabled={isAdding}
                  className="w-full btn-secondary flex items-center justify-center gap-2 py-4 text-lg"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Design
                </button>
              </div>
            </div>

            {/* Design Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
              <h3 className="font-semibold text-purple-900 mb-3">Your Custom Design</h3>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li>✓ High-quality print guaranteed</li>
                <li>✓ Design saved to your cart</li>
                <li>✓ Can be edited later from cart</li>
                <li>✓ Perfect clipping to product shape</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
