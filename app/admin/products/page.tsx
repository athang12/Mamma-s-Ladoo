'use client'

import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/supabase/api'
import type { Product } from '@/lib/supabase/types'
import { Pencil, Trash2, Plus, X, Save, Package } from 'lucide-react'
import { categories } from '@/lib/data'

type FormProduct = Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<FormProduct | null>(null)
  const [formData, setFormData] = useState<FormProduct>({
    name: '',
    description: '',
    price: 0,
    category: 'ACRYLIC_STANDS',
    customizable: false,
    stock: 0,
    featured: false,
    default_color: 'white',
    available_colors: ['white'],
    theme_tags: [],
    images: [''],
  })
  
  // File upload states
  const [productImageFiles, setProductImageFiles] = useState<File[]>([])
  const [templateImageFile, setTemplateImageFile] = useState<File | null>(null)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [templatePreview, setTemplatePreview] = useState<string>('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (productImageFiles.length === 0 && !editingProduct) {
      alert('Please upload at least one product image')
      return
    }
    
    if (formData.customizable && !templateImageFile && !editingProduct?.id) {
      alert('Customizable products require a template PNG')
      return
    }
    
    try {
      const formDataToSend = new FormData()
      
      // Add product data
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description || '')
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('category', formData.category)
      formDataToSend.append('stock', formData.stock.toString())
      formDataToSend.append('customizable', formData.customizable.toString())
      formDataToSend.append('featured', formData.featured.toString())
      formDataToSend.append('default_color', formData.default_color)
      formDataToSend.append('available_colors', JSON.stringify(formData.available_colors))
      
      // Add product images
      productImageFiles.forEach((file, index) => {
        formDataToSend.append(`productImage${index}`, file)
      })
      
      // Add template if customizable
      if (templateImageFile) {
        formDataToSend.append('templateImage', templateImageFile)
      }
      
      const response = await fetch('/api/admin/products/create', {
        method: 'POST',
        body: formDataToSend,
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save product')
      }
      
      await loadProducts()
      resetForm()
      alert('Product saved successfully!')
    } catch (error) {
      console.error('Error saving product:', error)
      alert(error instanceof Error ? error.message : 'Failed to save product')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      category: product.category,
      customizable: product.customizable,
      stock: product.stock,
      featured: product.featured,
      default_color: product.default_color || 'white',
      available_colors: product.available_colors || ['white'],
      theme_tags: product.theme_tags || [],
      images: product.images.length > 0 ? product.images : [''],
      id: product.id,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'ACRYLIC_STANDS',
      customizable: false,
      stock: 0,
      featured: false,
      default_color: 'white',
      available_colors: ['white'],
      theme_tags: [],
      images: [''],
    })
    setEditingProduct(null)
    setShowForm(false)
    setProductImageFiles([])
    setTemplateImageFile(null)
    setImagePreviews([])
    setTemplatePreview('')
  }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (productImageFiles.length + files.length > 3) {
      alert('Maximum 3 images allowed')
      return
    }
    
    const newFiles = [...productImageFiles, ...files]
    setProductImageFiles(newFiles)
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
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
    
    setTemplateImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setTemplatePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  const removeImagePreview = (index: number) => {
    setProductImageFiles(productImageFiles.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const toggleTheme = (theme: string) => {
    const themes = formData.theme_tags || []
    const newThemes = themes.includes(theme)
      ? themes.filter(t => t !== theme)
      : [...themes, theme]
    setFormData({ ...formData, theme_tags: newThemes })
  }

  const toggleColor = (color: string) => {
    const colors = formData.available_colors || []
    const newColors = colors.includes(color)
      ? colors.filter(c => c !== color)
      : [...colors, color]
    setFormData({ ...formData, available_colors: newColors })
  }

  const availableThemes = ['anime', 'motivation', 'aesthetic', 'valentine', 'custom']
  const availableColors = ['white', 'black', 'pink', 'blue', 'purple', 'red', 'yellow', 'green']

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Manage Products</h1>
          <p className="text-gray-600">Add, edit, or remove products from your store</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 outline-none"
                  placeholder="Custom Photo Acrylic Stand"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 outline-none"
                  rows={3}
                  placeholder="Beautiful transparent acrylic stand..."
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug.toUpperCase()}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Tags */}
              <div>
                <label className="block text-sm font-semibold mb-2">Theme Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableThemes.map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => toggleTheme(theme)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        (formData.theme_tags || []).includes(theme)
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Colors */}
              <div>
                <label className="block text-sm font-semibold mb-2">Available Colors</label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                        (formData.available_colors || []).includes(color)
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Color */}
              <div>
                <label className="block text-sm font-semibold mb-2">Default Color</label>
                <input
                  type="text"
                  value={formData.default_color}
                  onChange={(e) => setFormData({ ...formData, default_color: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 outline-none"
                  placeholder="white"
                />
              </div>

              {/* Product Images Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">Product Images (Upload)</label>
                <p className="text-sm text-gray-600 mb-3">Upload up to 3 images for this product</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img src={preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImagePreview(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                  
                  {productImageFiles.length < 3 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer flex flex-col items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Upload Image</span>
                      <span className="text-xs text-gray-500 mt-1">{productImageFiles.length}/3</span>
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
              
              {/* Template Image for Customizable Products */}
              {formData.customizable && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Template Image (PNG with transparent area)</label>
                  <p className="text-sm text-gray-600 mb-3">Upload a PNG with transparent area for customization clipping</p>
                  
                  {templatePreview ? (
                    <div className="relative w-64 h-64 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                      <img src={templatePreview} alt="Template" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          setTemplateImageFile(null)
                          setTemplatePreview('')
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer flex flex-col items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400 mb-2" />
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

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.customizable}
                    onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <span className="font-medium">Customizable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <span className="font-medium">Featured</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-500 flex gap-2">
                          {product.customizable && (
                            <span className="text-purple-600">Custom</span>
                          )}
                          {product.featured && (
                            <span className="text-pink-600">Featured</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {categories.find(c => c.slug.toUpperCase() === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-pink-600">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm">Click "Add Product" to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
