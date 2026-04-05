'use client'

import { useState } from 'react'
import { productColors } from '@/lib/data'
import { getProductTemplate } from '@/lib/constants/productTemplates'
import Image from 'next/image'

interface ProductPreviewProps {
  productName: string
  productType: string
  customImageUrl: string
  availableColors?: string[]
  selectedColor: string
  onColorChange: (color: string) => void
  basePrice: number
}

export default function ProductPreview({
  productName,
  productType,
  customImageUrl,
  availableColors = ['white'],
  selectedColor,
  onColorChange,
  basePrice,
}: ProductPreviewProps) {
  const template = getProductTemplate(productType)
  const currentColor = productColors[selectedColor as keyof typeof productColors] || productColors.white

  if (!template) {
    // Fallback if no template configured
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold mb-4">Product Preview</h3>
        <div className="bg-gray-100 rounded-xl p-8 mb-6 min-h-[400px] flex items-center justify-center">
          <img
            src={customImageUrl}
            alt="Custom design"
            className="max-w-full max-h-96 object-contain rounded-lg shadow-2xl"
          />
        </div>
        <p className="text-sm text-amber-600">
          Template not configured for this product type. Showing custom image only.
        </p>
      </div>
    )
  }

  const { customArea } = template

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold mb-4">Product Preview</h3>
      
      {/* Product with Custom Image Overlay */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-6 min-h-[500px] flex items-center justify-center">
        {/* Product Base Image with Custom Image Overlay */}
        <div className="relative w-full max-w-lg">
          {/* Base Product Image */}
          <img
            src={template.baseImage}
            alt={template.displayName}
            className="w-full h-auto block"
          />
          
          {/* Custom Image Overlay - Positioned based on template config */}
          {customImageUrl && (
            <img
              src={customImageUrl}
              alt="Your custom design"
              className="absolute"
              style={{
                top: `${customArea.top}%`,
                left: `${customArea.left}%`,
                width: `${customArea.width}%`,
                height: `${customArea.height}%`,
                objectFit: customArea.fit,
                transform: customArea.rotation ? `rotate(${customArea.rotation}deg)` : undefined,
              }}
            />
          )}
        </div>

        {/* Watermark */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-400 italic">
          Preview Only
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-1">{productName}</h4>
          <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            ₹{basePrice.toFixed(2)}
          </p>
        </div>

        {/* Color Selector */}
        {availableColors && availableColors.length > 1 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Color: <span className="capitalize">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((colorKey) => {
                const color = productColors[colorKey as keyof typeof productColors]
                if (!color) return null
                return (
                  <button
                    key={colorKey}
                    onClick={() => onColorChange(colorKey)}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
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

        {/* Design Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your design will be professionally printed in high quality. 
            The preview shows an approximation of the final product.
          </p>
        </div>
      </div>
    </div>
  )
}
