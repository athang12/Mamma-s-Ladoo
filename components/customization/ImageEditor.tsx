'use client'

import { useState, useRef, useEffect } from 'react'
import { RotateCw, ZoomIn, ZoomOut, Sliders, X, Type, Trash2, Bold, Italic, Underline } from 'lucide-react'

interface TextOverlay {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
}

interface ImageEditorProps {
  imageUrl: string
  onSave: (editedImageUrl: string) => void
  onCancel: () => void
}

export default function ImageEditor({ imageUrl, onSave, onCancel }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([])
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [draggedTextId, setDraggedTextId] = useState<string | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    img.onload = () => {
      setImage(img)
      drawCanvas(img, 0, 1, 100, 100, 100, [])
    }
  }, [imageUrl])

  const drawCanvas = (
    img: HTMLImageElement,
    rot: number,
    scl: number,
    bright: number,
    cont: number,
    sat: number,
    texts: TextOverlay[]
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 600

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context state
    ctx.save()

    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Apply rotation
    ctx.rotate((rot * Math.PI) / 180)

    // Apply scale
    ctx.scale(scl, scl)

    // Calculate dimensions to fit image
    const imgRatio = img.width / img.height
    let drawWidth = canvas.width
    let drawHeight = canvas.height

    if (imgRatio > 1) {
      drawHeight = canvas.width / imgRatio
    } else {
      drawWidth = canvas.height * imgRatio
    }

    // Apply filters
    ctx.filter = `brightness(${bright}%) contrast(${cont}%) saturate(${sat}%)`

    // Draw image centered
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)

    // Restore context state
    ctx.restore()

    // Draw text overlays
    texts.forEach((textOverlay) => {
      ctx.save()
      
      // Build font string
      let fontStyle = ''
      if (textOverlay.italic) fontStyle += 'italic '
      if (textOverlay.bold) fontStyle += 'bold '
      ctx.font = `${fontStyle}${textOverlay.fontSize}px ${textOverlay.fontFamily}`
      
      ctx.fillStyle = textOverlay.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Draw text
      ctx.fillText(textOverlay.text, textOverlay.x, textOverlay.y)
      
      // Draw underline if needed
      if (textOverlay.underline) {
        const metrics = ctx.measureText(textOverlay.text)
        ctx.beginPath()
        ctx.strokeStyle = textOverlay.color
        ctx.lineWidth = 2
        ctx.moveTo(textOverlay.x - metrics.width / 2, textOverlay.y + textOverlay.fontSize / 2 + 2)
        ctx.lineTo(textOverlay.x + metrics.width / 2, textOverlay.y + textOverlay.fontSize / 2 + 2)
        ctx.stroke()
      }
      
      ctx.restore()
    })
  }

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
    if (image) {
      drawCanvas(image, newRotation, scale, brightness, contrast, saturation, textOverlays)
    }
  }

  const handleScaleChange = (newScale: number) => {
    setScale(newScale)
    if (image) {
      drawCanvas(image, rotation, newScale, brightness, contrast, saturation, textOverlays)
    }
  }

  const handleBrightnessChange = (value: number) => {
    setBrightness(value)
    if (image) {
      drawCanvas(image, rotation, scale, value, contrast, saturation, textOverlays)
    }
  }

  const handleContrastChange = (value: number) => {
    setContrast(value)
    if (image) {
      drawCanvas(image, rotation, scale, brightness, value, saturation, textOverlays)
    }
  }

  const handleSaturationChange = (value: number) => {
    setSaturation(value)
    if (image) {
      drawCanvas(image, rotation, scale, brightness, contrast, value, textOverlays)
    }
  }

  const handleAddText = () => {
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: 'Your Text',
      x: 300,
      y: 300,
      fontSize: 32,
      fontFamily: 'Arial',
      color: '#000000',
      bold: false,
      italic: false,
      underline: false,
    }
    const updatedTexts = [...textOverlays, newText]
    setTextOverlays(updatedTexts)
    setSelectedTextId(newText.id)
    setShowTextEditor(true)
    if (image) {
      drawCanvas(image, rotation, scale, brightness, contrast, saturation, updatedTexts)
    }
  }

  const handleUpdateText = (id: string, updates: Partial<TextOverlay>) => {
    const updatedTexts = textOverlays.map((text) =>
      text.id === id ? { ...text, ...updates } : text
    )
    setTextOverlays(updatedTexts)
    if (image) {
      drawCanvas(image, rotation, scale, brightness, contrast, saturation, updatedTexts)
    }
  }

  const handleDeleteText = (id: string) => {
    const updatedTexts = textOverlays.filter((text) => text.id !== id)
    setTextOverlays(updatedTexts)
    if (selectedTextId === id) {
      setSelectedTextId(null)
      setShowTextEditor(false)
    }
    if (image) {
      drawCanvas(image, rotation, scale, brightness, contrast, saturation, updatedTexts)
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    // Check if clicked on any text (in reverse order to prioritize topmost)
    const clickedText = [...textOverlays].reverse().find((text) => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return false
      
      let fontStyle = ''
      if (text.italic) fontStyle += 'italic '
      if (text.bold) fontStyle += 'bold '
      ctx.font = `${fontStyle}${text.fontSize}px ${text.fontFamily}`
      
      const metrics = ctx.measureText(text.text)
      const textWidth = metrics.width
      const textHeight = text.fontSize * 1.5 // Increased hit area
      
      return (
        x >= text.x - textWidth / 2 - 10 &&
        x <= text.x + textWidth / 2 + 10 &&
        y >= text.y - textHeight / 2 - 10 &&
        y <= text.y + textHeight / 2 + 10
      )
    })

    if (clickedText) {
      setDraggedTextId(clickedText.id)
      setSelectedTextId(clickedText.id)
      setShowTextEditor(true)
    } else {
      // Clicked on empty area - deselect text
      setSelectedTextId(null)
      setShowTextEditor(false)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedTextId) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    handleUpdateText(draggedTextId, { x, y })
  }

  const handleCanvasMouseUp = () => {
    setDraggedTextId(null)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const editedImageUrl = canvas.toDataURL('image/png')
      onSave(editedImageUrl)
    }
  }

  const handleReset = () => {
    setRotation(0)
    setScale(1)
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    if (image) {
      drawCanvas(image, 0, 1, 100, 100, 100, textOverlays)
    }
  }

  const selectedText = textOverlays.find((text) => text.id === selectedTextId)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Edit Your Image</h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 p-6">
          {/* Canvas */}
          <div className="lg:col-span-2 flex justify-center bg-gray-50 rounded-lg p-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border border-gray-200 rounded cursor-crosshair"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={handleRotate}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span className="font-medium">Rotate</span>
              </button>
              <button
                onClick={() => handleScaleChange(Math.min(scale + 0.1, 2))}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
                <span className="font-medium">Zoom In</span>
              </button>
              <button
                onClick={() => handleScaleChange(Math.max(scale - 0.1, 0.5))}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
                <span className="font-medium">Zoom Out</span>
              </button>
              <button
                onClick={handleAddText}
                className="w-full flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
              >
                <Type className="w-4 h-4" />
                <span className="font-medium">Add Text</span>
              </button>
              <button
                onClick={handleReset}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="font-medium">Reset All</span>
              </button>
            </div>

            {/* Adjustments */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-700">Adjustments</h3>
              </div>

              {/* Brightness */}
              <div>
                <label className="flex justify-between text-sm font-medium mb-2">
                  <span>Brightness</span>
                  <span className="text-gray-500">{brightness}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Contrast */}
              <div>
                <label className="flex justify-between text-sm font-medium mb-2">
                  <span>Contrast</span>
                  <span className="text-gray-500">{contrast}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => handleContrastChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Saturation */}
              <div>
                <label className="flex justify-between text-sm font-medium mb-2">
                  <span>Saturation</span>
                  <span className="text-gray-500">{saturation}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => handleSaturationChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Zoom */}
              <div>
                <label className="flex justify-between text-sm font-medium mb-2">
                  <span>Zoom</span>
                  <span className="text-gray-500">{Math.round(scale * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={scale * 100}
                  onChange={(e) => handleScaleChange(Number(e.target.value) / 100)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>

            {/* Text Editor */}
            {showTextEditor && selectedText && (
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Edit Text
                  </h3>
                  <button
                    onClick={() => handleDeleteText(selectedText.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Text Input */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Text</label>
                  <input
                    type="text"
                    value={selectedText.text}
                    onChange={(e) => handleUpdateText(selectedText.id, { text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-pink-500 outline-none"
                  />
                </div>

                {/* Font Family */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Font</label>
                  <select
                    value={selectedText.fontFamily}
                    onChange={(e) => handleUpdateText(selectedText.id, { fontFamily: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-pink-500 outline-none"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Impact">Impact</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Brush Script MT">Brush Script MT</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="flex justify-between text-sm font-medium mb-1">
                    <span>Size</span>
                    <span className="text-gray-500">{selectedText.fontSize}px</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => handleUpdateText(selectedText.id, { fontSize: Math.max(12, selectedText.fontSize - 2) })}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={selectedText.fontSize}
                      onChange={(e) => handleUpdateText(selectedText.id, { fontSize: Number(e.target.value) })}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <button
                      onClick={() => handleUpdateText(selectedText.id, { fontSize: Math.min(120, selectedText.fontSize + 2) })}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Text Color</label>
                  <div className="space-y-2">
                    {/* Color Presets */}
                    <div className="grid grid-cols-8 gap-2">
                      {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                        '#800000', '#808080', '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#FFD700', '#4B0082'].map((color) => (
                        <button
                          key={color}
                          onClick={() => handleUpdateText(selectedText.id, { color })}
                          className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                            selectedText.color.toUpperCase() === color ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    {/* Custom Color Picker */}
                    <div className="flex gap-2 items-center">
                      <label className="text-xs text-gray-600">Custom:</label>
                      <input
                        type="color"
                        value={selectedText.color}
                        onChange={(e) => handleUpdateText(selectedText.id, { color: e.target.value })}
                        className="w-10 h-8 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={selectedText.color}
                        onChange={(e) => handleUpdateText(selectedText.id, { color: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:border-pink-500 outline-none"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Text Styles */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Style</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateText(selectedText.id, { bold: !selectedText.bold })}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedText.bold
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateText(selectedText.id, { italic: !selectedText.italic })}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedText.italic
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateText(selectedText.id, { underline: !selectedText.underline })}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedText.underline
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 italic bg-white p-2 rounded">
                  💡 Tip: Click on text in the canvas to select and edit it, then drag to move
                </p>
              </div>
            )}

            {/* Text List */}
            {textOverlays.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Text Layers ({textOverlays.length})</h4>
                <div className="space-y-1">
                  {textOverlays.map((text) => (
                    <button
                      key={text.id}
                      onClick={() => {
                        setSelectedTextId(text.id)
                        setShowTextEditor(true)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedTextId === text.id
                          ? 'bg-pink-100 border-2 border-pink-400'
                          : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate font-medium">{text.text || 'Empty text'}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteText(text.id)
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  )
}
