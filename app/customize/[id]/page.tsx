'use client'

/**
 * ⚠️ DEPRECATED: This old customizer is no longer in use.
 * Please use the new canvas-based customizer at /customize-new/[id] instead.
 * This file is kept for reference only.
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { productColors } from '@/lib/data'
import { useCartStore } from '@/lib/store'
import ImageUploader from '@/components/customization/ImageUploader'
import ImageEditor from '@/components/customization/ImageEditor'
import ProductPreview from '@/components/customization/ProductPreview'
import { ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react'
import { getProductTemplate } from '@/lib/constants/productTemplates'
import { createProductComposite } from '@/lib/utils/imageComposite'
import { getProductById } from '@/lib/supabase/api'
import type { Product } from '@/lib/supabase/types'

export default function CustomizePage() {
  const params = useParams()
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const productId = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const [step, setStep] = useState<'upload' | 'edit' | 'preview'>('upload')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('')
  const [editedImageUrl, setEditedImageUrl] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('white')
  const [isAdding, setIsAdding] = useState(false)

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

  const handleImageSelect = (file: File, previewUrl: string) => {
    setUploadedFile(file)
    setOriginalImageUrl(previewUrl)
    setStep('edit')
  }

  const handleImageSave = (editedUrl: string) => {
    setEditedImageUrl(editedUrl)
    setStep('preview')
  }

  const handleEditCancel = () => {
    setStep('upload')
    setOriginalImageUrl('')
    setUploadedFile(null)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    try {
      // Generate composite image showing the product with custom overlay
      const template = getProductTemplate(product.category)
      let thumbnailUrl = editedImageUrl
      
      if (template) {
        console.log('Creating composite with template:', template)
        try {
          // Create composite image for cart thumbnail
          // Ensure base image URL is absolute
          const baseImagePath = template.baseImage.startsWith('http') 
            ? template.baseImage 
            : `${window.location.origin}${template.baseImage}`
          
          console.log('Base image path:', baseImagePath)
          console.log('Custom image URL length:', editedImageUrl.length)
          
          thumbnailUrl = await createProductComposite(
            baseImagePath,
            editedImageUrl,
            template.customArea
          )
          
          console.log('Composite created successfully, length:', thumbnailUrl.length)
        } catch (error) {
          console.error('Failed to create composite:', error)
          // Fallback to edited image
          thumbnailUrl = editedImageUrl
        }
      } else {
        console.warn('No template found for category:', product.category)
      }
      
      // Add to cart with composite image as thumbnail
      addItem({
        productId: product.id,
        product: {
          name: product.name,
          thumbnailUrl: thumbnailUrl,
          basePrice: Number(product.price),
        },
        quantity: 1,
        selectedColor: selectedColor,
        customImageUrl: editedImageUrl,
        customImageData: {
          rotation: 0,
          scale: 1,
          positionX: 0,
          positionY: 0,
          flipHorizontal: false,
          flipVertical: false,
        },
      })

      setTimeout(() => {
        setIsAdding(false)
        router.push('/cart')
      }, 1500)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAdding(false)
    }
  }

  const handleBackToEdit = () => {
    setStep('edit')
  }

  const handleStartOver = () => {
    setStep('upload')
    setOriginalImageUrl('')
    setEditedImageUrl('')
    setUploadedFile(null)
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
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Customize Your {product.name}
          </h1>
          <p className="text-gray-600">
            Upload your design and see it come to life on your product
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step === 'upload' ? 'bg-pink-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="hidden sm:inline font-medium">Upload</span>
            </div>
            
            <div className="h-0.5 w-12 sm:w-20 bg-gray-300"></div>
            
            <div className={`flex items-center gap-2 ${step === 'edit' ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step === 'edit' ? 'bg-pink-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="hidden sm:inline font-medium">Edit</span>
            </div>
            
            <div className="h-0.5 w-12 sm:w-20 bg-gray-300"></div>
            
            <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step === 'preview' ? 'bg-pink-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="hidden sm:inline font-medium">Preview</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {step === 'upload' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Upload Your Design
                </h2>
                <ImageUploader onImageSelect={handleImageSelect} />
                
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Tips for Best Results:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use high-resolution images (at least 1000x1000px)</li>
                    <li>• Make sure your design has good contrast</li>
                    <li>• Avoid images that are too dark or too light</li>
                    <li>• Center your main subject in the image</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 'edit' && originalImageUrl && (
            <ImageEditor
              imageUrl={originalImageUrl}
              onSave={handleImageSave}
              onCancel={handleEditCancel}
            />
          )}

          {step === 'preview' && editedImageUrl && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <ProductPreview
                  productName={product.name}
                  productType={product.category}
                  customImageUrl={editedImageUrl}
                  availableColors={product.available_colors}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  basePrice={product.price}
                />
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-semibold">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-semibold capitalize">{selectedColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customization:</span>
                      <span className="font-semibold text-green-600">Included</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-pink-600">${Number(product.price).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <>
                        <CheckCircle className="w-5 h-5 animate-pulse" />
                        <span>Adding to Cart...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleBackToEdit}
                      className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Edit Design
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Start Over
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    What's Included:
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>✓ High-quality printing</li>
                    <li>✓ Professional finishing</li>
                    <li>✓ Satisfaction guaranteed</li>
                    <li>✓ Fast processing & shipping</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
