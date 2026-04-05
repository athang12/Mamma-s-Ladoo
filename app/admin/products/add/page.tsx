'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Check } from 'lucide-react'
import Link from 'next/link'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'ACRYLIC_STANDS',
    stock: '10',
    customizable: false,
    featured: false,
    default_color: 'white',
    available_colors: ['white'],
  })
  
  const [productImages, setProductImages] = useState<File[]>([])
  const [templateImage, setTemplateImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [templatePreview, setTemplatePreview] = useState<string>('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (productImages.length + files.length > 3) {
      alert('Maximum 3 images allowed')
      return
    }
    
    setProductImages([...productImages, ...files])
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.includes('png')) {
      alert('Template must be a PNG file')
      return
    }
    
    setTemplateImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setTemplatePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index))
    setImagePreview(imagePreview.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (productImages.length === 0) {
      alert('Please upload at least one product image')
      return
    }
    
    if (formData.customizable && !templateImage) {
      alert('Customizable products require a template PNG with transparent area')
      return
    }
    
    setLoading(true)
    
    try {
      const formDataToSend = new FormData()
      
      // Add product data
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('customizable', formData.customizable.toString())
      formDataToSend.append('featured', formData.featured.toString())
      formDataToSend.append('default_color', formData.default_color)
      formDataToSend.append('available_colors', JSON.stringify(formData.available_colors))
      
      // Add product images
      productImages.forEach((file, index) => {
        formDataToSend.append(`productImage${index}`, file)
      })
      
      // Add template if customizable
      if (templateImage) {
        formDataToSend.append('templateImage', templateImage)
      }
      
      const response = await fetch('/api/admin/products/create', {
        method: 'POST',
        body: formDataToSend,
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create product')
      }
      
      alert('Product created successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      alert(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'ACRYLIC_STANDS', label: 'Acrylic Stands' },
    { value: 'COFFEE_MUGS', label: 'Coffee Mugs' },
    { value: 'JIGSAW_PUZZLES', label: 'Jigsaw Puzzles' },
    { value: 'HANDKERCHIEFS', label: 'Handkerchiefs' },
    { value: 'TOTE_BAGS', label: 'Tote Bags' },
    { value: 'DAILY_PLANNERS', label: 'Daily Planners' },
    { value: 'WALL_FRAMES', label: 'Wall Frames' },
    { value: 'FRIDGE_MAGNETS', label: 'Fridge Magnets' },
  ]

  const colors = ['white', 'black', 'red', 'blue', 'green', 'yellow', 'pink', 'purple']

  return (
    <div>
      <Link
        href="/admin/products"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Products
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p className="text-gray-600">Create a new product listing for your store</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Personalized Acrylic Stand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="299.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="10"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your product..."
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product Images *</h2>
          <p className="text-sm text-gray-600 mb-4">Upload up to 3 images for this product. These will be displayed in the product carousel.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imagePreview.map((preview, index) => (
              <div key={index} className="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden">
                <img src={preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Image {index + 1}
                </div>
              </div>
            ))}
            
            {productImages.length < 3 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Upload Image</span>
                <span className="text-xs text-gray-500 mt-1">{productImages.length}/3</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Customization Options */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customization Options</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.customizable}
                onChange={(e) => setFormData({...formData, customizable: e.target.checked})}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div>
                <span className="font-medium text-gray-900">Make this product customizable</span>
                <p className="text-sm text-gray-600">Allow customers to upload images and customize this product</p>
              </div>
            </label>

            {formData.customizable && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Image (PNG with transparent area) *
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a PNG image with a transparent area where the custom design will appear. The transparent area defines the clipping boundary.
                </p>
                
                {templatePreview ? (
                  <div className="relative w-64 h-64 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                    <img src={templatePreview} alt="Template" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setTemplateImage(null)
                        setTemplatePreview('')
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Template PNG</span>
                    <input
                      type="file"
                      accept="image/png"
                      onChange={handleTemplateUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="font-medium text-gray-900">Featured product</span>
            </label>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Colors</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colors.map(color => (
              <label key={color} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available_colors.includes(color)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        available_colors: [...formData.available_colors, color]
                      })
                    } else {
                      setFormData({
                        ...formData,
                        available_colors: formData.available_colors.filter(c => c !== color)
                      })
                    }
                  }}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="capitalize">{color}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 focus:ring-4 focus:ring-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Creating Product...'
            ) : (
              <>
                <Check className="w-5 h-5" />
                Create Product
              </>
            )}
          </button>
          
          <Link
            href="/admin/products"
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
