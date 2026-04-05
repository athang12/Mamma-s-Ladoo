'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'

interface ImageUploaderProps {
  onImageSelect: (file: File, previewUrl: string) => void
  maxSizeMB?: number
  acceptedFormats?: string[]
}

export default function ImageUploader({
  onImageSelect,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Please upload a valid image (${acceptedFormats.map(f => f.split('/')[1]).join(', ')})`
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    setError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const previewUrl = reader.result as string
      setPreview(previewUrl)
      onImageSelect(file, previewUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const clearImage = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleInputChange}
        className="hidden"
        id="image-upload"
      />

      {!preview ? (
        <label
          htmlFor="image-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`block w-full cursor-pointer transition-all ${
            isDragging
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-300 hover:border-pink-400 bg-gray-50 hover:bg-pink-50'
          } border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDragging ? 'bg-pink-200' : 'bg-gray-200'
            }`}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-pink-600' : 'text-gray-600'}`} />
            </div>
            
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {isDragging ? 'Drop your image here' : 'Upload Your Design'}
              </p>
              <p className="text-sm text-gray-500">
                Drag & drop or click to browse
              </p>
            </div>

            <div className="text-xs text-gray-400">
              <p>Supported formats: JPG, PNG, WEBP</p>
              <p>Max size: {maxSizeMB}MB</p>
            </div>
          </div>
        </label>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-300">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 sm:h-80 object-contain"
          />
          <button
            onClick={clearImage}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label="Remove image"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Image uploaded successfully
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
