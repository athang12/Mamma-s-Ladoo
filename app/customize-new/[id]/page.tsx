'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react'
import CanvasEditor, { DesignData } from '@/components/customization/CanvasEditor'
import { useCartStore } from '@/lib/store'
import { useDesignStore } from '@/lib/store/designStore'
import { getProductById } from '@/lib/supabase/api'
import type { Product } from '@/lib/supabase/types'

export default function NewCustomizePage() {
  const params = useParams()
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const setDesign = useDesignStore((state) => state.setDesign)

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

  const handleSaveDesign = async (finalImageURL: string, designData: DesignData) => {
    console.log('handleSaveDesign called!')
    console.log('Product:', product)
    console.log('Image URL length:', finalImageURL.length)
    console.log('Design data:', designData)
    
    if (!product) {
      console.error('Product is null!')
      return
    }

    setIsAdding(true)
    
    try {
      console.log('Storing design in Zustand store...')
      // Store design data in memory using Zustand (avoids localStorage quota issues)
      setDesign(finalImageURL, designData, product.id)
      
      console.log('Navigating to preview page...')
      // Navigate to preview page
      router.push(`/preview/${product.id}`)
    } catch (error) {
      console.error('Error saving design:', error)
      setIsAdding(false)
    }
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={() => router.push('/products')}
          className="btn-primary"
        >
          Back to Products
        </button>
      </div>
    )
  }

  if (!product.customizable) {
    router.push(`/products/${productId}`)
    return null
  }

  // Use product template image or fallback to first product image
  const templateImage = product.template_image || product.images[0] || '/images/product-templates/acrylic-stand.png'
  const maskImage = product.mask_image

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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Design Your {product.name}
              </h1>
              <p className="text-gray-600">
                Upload images, add text, and create your perfect design
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Base Price</p>
              <p className="text-2xl font-bold text-purple-600">₹{product.price}</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {isAdding && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-medium">Design saved! Redirecting to preview...</span>
          </div>
        )}

        {/* Canvas Editor */}
        <CanvasEditor
          productImage={templateImage}
          maskImage={maskImage}
          width={800}
          height={800}
          onSave={handleSaveDesign}
        />

        {/* Info Box */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-2">Design Tips:</h3>
          <ul className="space-y-2 text-purple-700 text-sm">
            <li>• Drag to position images and text anywhere on the canvas</li>
            <li>• Use corner handles to resize objects (maintains aspect ratio)</li>
            <li>• Rotate objects for creative angles</li>
            <li>• Double-click text to edit content</li>
            <li>• Try different fonts to match your style</li>
            <li>• Objects outside the design area will be automatically cropped</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
