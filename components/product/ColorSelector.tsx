'use client'

import { useState } from 'react'

interface ColorOption {
  name: string
  hex: string
  imageUrl?: string
}

interface ColorSelectorProps {
  colors: ColorOption[]
  selectedColor: string
  onColorChange: (colorName: string) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function ColorSelector({
  colors,
  selectedColor,
  onColorChange,
  size = 'md',
}: ColorSelectorProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Color: <span className="capitalize">{selectedColor}</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = color.name === selectedColor
          return (
            <button
              key={color.name}
              onClick={() => onColorChange(color.name)}
              className={`${sizeClasses[size]} rounded-full border-2 transition-all hover:scale-110 ${
                isSelected
                  ? 'border-pink-500 ring-2 ring-pink-200'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            >
              {isSelected && (
                <svg
                  className="w-full h-full p-1 text-white drop-shadow-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
