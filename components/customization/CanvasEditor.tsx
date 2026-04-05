'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, Type, RotateCw, Trash2, ZoomIn, ZoomOut, Download } from 'lucide-react'
import { CREATIVE_FONTS, getFontsByStyle } from '@/lib/constants/fonts'
import type { FontName } from '@/lib/constants/fonts'

// Dynamic import for Fabric.js v5 (browser-only)
let fabric: any = null

if (typeof window !== 'undefined') {
  import('fabric').then((module: any) => {
    fabric = module.fabric || module.default || module
    console.log('Fabric.js loaded:', fabric)
  })
}

interface CanvasEditorProps {
  productImage: string // Background image with transparent design area
  maskImage?: string // Optional: Frame overlay for clipping (Layer 3)
  width?: number
  height?: number
  onSave?: (dataURL: string, designData: DesignData) => void
}

export interface DesignData {
  images: ImageLayer[]
  texts: TextLayer[]
  canvasWidth: number
  canvasHeight: number
}

interface ImageLayer {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  scaleX: number
  scaleY: number
  angle: number
}

interface TextLayer {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: FontName
  fill: string
  angle: number
  scaleX: number
  scaleY: number
}

export default function CanvasEditor({
  productImage,
  maskImage,
  width = 800,
  height = 800,
  onSave
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<any>(null)
  const [selectedFont, setSelectedFont] = useState<FontName>('Poppins')
  const [textColor, setTextColor] = useState('#000000')
  const [activeObject, setActiveObject] = useState<any>(null)
  const [fabricReady, setFabricReady] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  // Wait for fonts to load
  useEffect(() => {
    if (typeof document === 'undefined') return
    
    // Check if fonts are ready
    const checkFonts = async () => {
      if ('fonts' in document) {
        try {
          // Explicitly load each font
          const fontPromises = CREATIVE_FONTS.map(font => 
            (document as any).fonts.load(`400 16px "${font.name}"`)
          )
          await Promise.all(fontPromises)
          await (document as any).fonts.ready
          
          // Verify fonts are actually available
          const loadedFonts = CREATIVE_FONTS.map(font => {
            const available = (document as any).fonts.check(`16px "${font.name}"`)
            console.log(`Font "${font.name}" available:`, available)
            return available
          })
          
          console.log('All fonts loaded!', loadedFonts)
          setFontsLoaded(true)
        } catch (err) {
          console.error('Font loading error:', err)
          setFontsLoaded(true)
        }
      } else {
        // Fallback for browsers without Font Loading API
        setTimeout(() => setFontsLoaded(true), 2000)
      }
    }
    
    checkFonts()
  }, [])

  // Wait for fabric to load
  useEffect(() => {
    const checkFabric = setInterval(() => {
      if (fabric && fabric.Canvas) {
        console.log('Fabric ready!')
        setFabricReady(true)
        clearInterval(checkFabric)
      }
    }, 100)

    return () => clearInterval(checkFabric)
  }, [])

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || !fabricReady || !fontsLoaded) {
      console.log('Waiting for fabric and fonts...', { canvasRef: canvasRef.current, fabricReady, fontsLoaded })
      return
    }

    console.log('Initializing canvas...')
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#f5f5f5',
    })

    console.log('Canvas created, loading template image:', productImage)

    let clipPathImage: any = null

    // Load product background image (Layer 1) - this also defines the clipping area
    fabric.Image.fromURL(productImage, (img: any) => {
      console.log('Template image loaded:', img)
      
      // Create a copy for clipping (inverted - transparent areas become clipping region)
      fabric.Image.fromURL(productImage, (clipImg: any) => {
        clipImg.set({
          left: 0,
          top: 0,
          scaleX: width / (clipImg.width || width),
          scaleY: height / (clipImg.height || height),
          absolutePositioned: true,
          inverted: true, // Invert so transparent areas show content
        })
        clipPathImage = clipImg
        ;(fabricCanvas as any).clipPathImage = clipPathImage
        console.log('Clip path created from template')
      }, { crossOrigin: 'anonymous' })
      
      img.set({
        left: 0,
        top: 0,
        scaleX: width / (img.width || width),
        scaleY: height / (img.height || height),
        selectable: false,
        evented: false,
      })
      fabricCanvas.add(img)
      fabricCanvas.sendToBack(img)
      fabricCanvas.renderAll()
      console.log('Template image added to canvas')
    }, { crossOrigin: 'anonymous' })

    // Load mask overlay if provided (Layer 3 - goes on top)
    if (maskImage) {
      console.log('Loading mask image:', maskImage)
      fabric.Image.fromURL(maskImage, (mask: any) => {
        mask.set({
          left: 0,
          top: 0,
          scaleX: width / (mask.width || width),
          scaleY: height / (mask.height || height),
          selectable: false,
          evented: false,
        })
        fabricCanvas.add(mask)
        fabricCanvas.bringToFront(mask)
        fabricCanvas.renderAll()
        console.log('Mask image added')
      }, { crossOrigin: 'anonymous' })
    }

    // Selection events
    fabricCanvas.on('selection:created', (e: any) => {
      console.log('Selection created:', e)
      setActiveObject(e.selected?.[0] || null)
    })

    fabricCanvas.on('selection:updated', (e: any) => {
      setActiveObject(e.selected?.[0] || null)
    })

    fabricCanvas.on('selection:cleared', () => {
      setActiveObject(null)
    })

    setCanvas(fabricCanvas)

    return () => {
      console.log('Disposing canvas')
      fabricCanvas.dispose()
    }
  }, [productImage, maskImage, width, height, fabricReady, fontsLoaded])

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !canvas) {
      console.log('No file or canvas:', { file, canvas })
      return
    }

    // Check file size (limit to 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      alert('Image size is too large. Please upload an image smaller than 2MB.')
      if (e?.target) {
        e.target.value = '' // Reset input
      }
      return
    }

    console.log('Uploading image:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB')

    const reader = new FileReader()
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string
      
      if (!fabric) {
        console.error('Fabric not loaded')
        return
      }
      
      console.log('Loading uploaded image...')
      fabric.Image.fromURL(imgUrl, (img: any) => {
        console.log('Uploaded image loaded:', img)
        // Scale to fit canvas (max 50% of canvas size)
        const maxWidth = width * 0.5
        const maxHeight = height * 0.5
        const scale = Math.min(maxWidth / (img.width || 1), maxHeight / (img.height || 1))

        img.set({
          left: width / 2,
          top: height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
          clipPath: (canvas as any).clipPathImage,
        })

        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.requestRenderAll()
        console.log('Uploaded image added to canvas')
      })
    }
    reader.readAsDataURL(file)
  }

  // Add text box
  const handleAddText = () => {
    if (!canvas || !fabric) {
      console.log('No canvas or fabric:', { canvas, fabric })
      return
    }

    console.log('Adding text box')

    const text = new fabric.IText('Double-click to edit', {
      left: width / 2,
      top: height / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: `"${selectedFont}", Arial, sans-serif`,
      fontSize: 40,
      fill: textColor,
      clipPath: (canvas as any).clipPathImage,
    })

    console.log('Text object created:', text.type, 'Font:', text.fontFamily)

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.requestRenderAll()
  }

  // Delete selected object
  const handleDelete = () => {
    if (!canvas || !activeObject) return
    canvas.remove(activeObject)
    canvas.requestRenderAll()
    setActiveObject(null)
  }

  // Rotate selected object
  const handleRotate = () => {
    if (!activeObject) return
    activeObject.rotate((activeObject.angle || 0) + 15)
    canvas?.requestRenderAll()
  }

  // Change font of selected text
  const handleFontChange = (font: FontName) => {
    console.log('Changing font to:', font)
    setSelectedFont(font)
    if (!activeObject || !canvas) {
      console.log('No object selected')
      return
    }
    
    // Save current properties
    const currentText = activeObject.text
    const currentLeft = activeObject.left
    const currentTop = activeObject.top
    const currentAngle = activeObject.angle
    const currentScaleX = activeObject.scaleX
    const currentScaleY = activeObject.scaleY
    const currentFill = activeObject.fill
    const currentFontSize = activeObject.fontSize
    const clipPath = (canvas as any).clipPathImage
    
    // Remove old text object
    canvas.remove(activeObject)
    
    // Create new text object with new font
    const newText = new fabric.IText(currentText, {
      left: currentLeft,
      top: currentTop,
      angle: currentAngle,
      scaleX: currentScaleX,
      scaleY: currentScaleY,
      fontFamily: `"${font}", Arial, sans-serif`,
      fontSize: currentFontSize,
      fill: currentFill,
      clipPath: clipPath,
    })
    
    canvas.add(newText)
    canvas.setActiveObject(newText)
    canvas.renderAll()
    
    console.log('Font changed. New text created with font:', font)
  }

  // Change color of selected text
  const handleColorChange = (color: string) => {
    setTextColor(color)
    if (!activeObject) return
    activeObject.set('fill', color)
    canvas?.renderAll()
  }

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (!canvas) return
    const zoom = canvas.getZoom()
    const newZoom = direction === 'in' ? zoom * 1.1 : zoom / 1.1
    canvas.setZoom(Math.max(0.5, Math.min(3, newZoom)))
  }

  // Export final design
  const handleExport = () => {
    console.log('handleExport called')
    console.log('Canvas:', canvas)
    console.log('onSave:', onSave)
    
    if (!canvas) {
      console.error('Canvas is not ready!')
      return
    }

    // Deselect all objects for clean export
    canvas.discardActiveObject()
    canvas.requestRenderAll()

    console.log('Generating design image...')
    // Generate image
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // Higher resolution
    })

    // Extract design data
    const designData: DesignData = {
      images: [],
      texts: [],
      canvasWidth: width,
      canvasHeight: height
    }

    canvas.getObjects().forEach((obj: any) => {
      if (obj.type === 'image' && obj.selectable) {
        designData.images.push({
          id: (obj as any).id || Math.random().toString(),
          src: (obj as any).getSrc(),
          x: obj.left || 0,
          y: obj.top || 0,
          width: obj.width || 0,
          height: obj.height || 0,
          scaleX: obj.scaleX || 1,
          scaleY: obj.scaleY || 1,
          angle: obj.angle || 0
        })
      } else if (obj.type === 'i-text') {
        const textObj = obj as any
        designData.texts.push({
          id: (obj as any).id || Math.random().toString(),
          text: textObj.text || '',
          x: obj.left || 0,
          y: obj.top || 0,
          fontSize: textObj.fontSize || 20,
          fontFamily: (textObj.fontFamily as FontName) || 'Poppins',
          fill: (textObj.fill as string) || '#000000',
          angle: obj.angle || 0,
          scaleX: obj.scaleX || 1,
          scaleY: obj.scaleY || 1
        })
      }
    })

    console.log('Design data prepared:', designData)
    console.log('Calling onSave with dataURL length:', dataURL.length)
    
    if (onSave) {
      onSave(dataURL, designData)
    } else {
      console.error('onSave callback is not defined!')
    }
  }

  const fontsByStyle = getFontsByStyle()
  const isTextSelected = activeObject?.type === 'i-text'

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col items-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
        </div>

        {/* Zoom Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => handleZoom('out')}
            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleZoom('in')}
            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="lg:w-80 space-y-4">
        {/* Upload Image */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Image
          </h3>
          <label className="btn-primary w-full cursor-pointer text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            Choose Image
          </label>
        </div>

        {/* Add Text */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Type className="w-5 h-5" />
            Add Text
          </h3>
          <button onClick={handleAddText} className="btn-primary w-full">
            Add Text Box
          </button>
        </div>

        {/* Font Selector (when text selected) */}
        {isTextSelected && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold mb-3">Font Style</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Object.entries(fontsByStyle).map(([style, fonts]) => (
                <div key={style}>
                  <p className="text-xs text-gray-500 uppercase mb-2">{style}</p>
                  {fonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => handleFontChange(font.name)}
                      className={`w-full text-left p-2 rounded hover:bg-purple-50 transition-colors ${
                        selectedFont === font.name ? 'bg-purple-100' : ''
                      }`}
                      style={{ fontFamily: font.name }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color Picker (when text selected) */}
        {isTextSelected && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold mb-3">Text Color</h3>
            
            {/* Quick Color Presets */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
                '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'].map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${
                    textColor === color ? 'border-purple-500 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            
            {/* Custom Color Picker */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Custom Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-12 rounded-lg cursor-pointer border border-gray-300"
              />
            </div>
          </div>
        )}

        {/* Object Controls (when something selected) */}
        {activeObject && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold mb-3">Object Controls</h3>
            <div className="flex gap-2">
              <button
                onClick={handleRotate}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
                title="Rotate 15°"
              >
                <RotateCw className="w-4 h-4" />
                Rotate
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Export */}
        <button
          onClick={handleExport}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Save Design
        </button>
      </div>
    </div>
  )
}
