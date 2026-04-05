'use client'

import { useState } from 'react'
import { products as localProducts } from '@/lib/data'
import { createProduct } from '@/lib/supabase/api'
import { CheckCircle, AlertCircle, Loader, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MigratePage() {
  const [migrating, setMigrating] = useState(false)
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: [],
  })
  const [completed, setCompleted] = useState(false)

  const handleMigrate = async () => {
    setMigrating(true)
    setResults({ success: 0, failed: 0, errors: [] })

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const product of localProducts) {
      try {
        await createProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          customizable: product.customizable,
          stock: product.stock,
          featured: product.featured,
          default_color: product.defaultColor || 'white',
          available_colors: product.availableColors || ['white'],
          theme_tags: product.themeTags || [],
          images: product.images,
        })
        success++
        setResults(prev => ({ ...prev, success: success }))
      } catch (error: any) {
        failed++
        errors.push(`${product.name}: ${error.message}`)
        setResults(prev => ({ ...prev, failed: failed, errors: errors }))
      }
    }

    setMigrating(false)
    setCompleted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Migrate Products</h1>
              <p className="text-gray-600 mt-1">Import products from code to database</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Import Products</h2>
            <p className="text-gray-600 mb-6">
              This will import {localProducts.length} products from your code into the Supabase database.
              Products that already exist will be skipped.
            </p>

            {!completed && !migrating && (
              <button
                onClick={handleMigrate}
                className="w-full btn-primary py-4 text-lg"
              >
                Start Migration
              </button>
            )}

            {migrating && (
              <div className="text-center py-8">
                <Loader className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
                <p className="text-lg font-semibold">Migrating products...</p>
                <p className="text-gray-600 mt-2">
                  {results.success} of {localProducts.length} imported
                </p>
              </div>
            )}

            {completed && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Migration Complete!</p>
                    <p className="text-green-700 text-sm">
                      Successfully imported {results.success} products
                    </p>
                  </div>
                </div>

                {results.failed > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="font-semibold text-red-900">
                        {results.failed} products failed to import
                      </p>
                    </div>
                    <div className="space-y-1 text-sm text-red-700">
                      {results.errors.map((error, index) => (
                        <p key={index}>• {error}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Link href="/admin/products" className="flex-1 btn-primary text-center py-3">
                    View Products
                  </Link>
                  <button
                    onClick={() => {
                      setCompleted(false)
                      setResults({ success: 0, failed: 0, errors: [] })
                    }}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Run Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What happens during migration?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All {localProducts.length} products will be imported</li>
              <li>• Product images, prices, and details will be preserved</li>
              <li>• Stock levels and categories will be imported</li>
              <li>• Theme tags and customization settings included</li>
              <li>• Duplicate products will be skipped (safe to run multiple times)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
