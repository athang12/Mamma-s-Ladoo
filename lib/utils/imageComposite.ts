// Utility to create a composite image of product with custom overlay
export async function createProductComposite(
  baseImageUrl: string,
  customImageUrl: string,
  overlayConfig: {
    top: number
    left: number
    width: number
    height: number
    fit: 'cover' | 'contain' | 'fill'
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    const baseImage = new Image()
    // Don't set crossOrigin for local images
    if (baseImageUrl.startsWith('http')) {
      baseImage.crossOrigin = 'anonymous'
    }
    
    baseImage.onload = () => {
      // Set canvas size to match base image
      canvas.width = baseImage.width
      canvas.height = baseImage.height
      
      // Draw base product image
      ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height)
      
      // Load and draw custom image overlay
      const customImage = new Image()
      // Custom image is a data URL, no CORS needed
      
      customImage.onload = () => {
        // Calculate overlay position and size based on percentages
        const overlayX = (overlayConfig.left / 100) * baseImage.width
        const overlayY = (overlayConfig.top / 100) * baseImage.height
        const overlayWidth = (overlayConfig.width / 100) * baseImage.width
        const overlayHeight = (overlayConfig.height / 100) * baseImage.height
        
        // Calculate custom image dimensions based on fit mode
        let drawWidth = overlayWidth
        let drawHeight = overlayHeight
        let drawX = overlayX
        let drawY = overlayY
        
        if (overlayConfig.fit === 'contain') {
          const imageAspect = customImage.width / customImage.height
          const targetAspect = overlayWidth / overlayHeight
          
          if (imageAspect > targetAspect) {
            // Image is wider - fit to width
            drawWidth = overlayWidth
            drawHeight = overlayWidth / imageAspect
            drawY = overlayY + (overlayHeight - drawHeight) / 2
          } else {
            // Image is taller - fit to height
            drawHeight = overlayHeight
            drawWidth = overlayHeight * imageAspect
            drawX = overlayX + (overlayWidth - drawWidth) / 2
          }
        } else if (overlayConfig.fit === 'cover') {
          const imageAspect = customImage.width / customImage.height
          const targetAspect = overlayWidth / overlayHeight
          
          if (imageAspect > targetAspect) {
            // Image is wider - fit to height
            drawHeight = overlayHeight
            drawWidth = overlayHeight * imageAspect
            drawX = overlayX - (drawWidth - overlayWidth) / 2
          } else {
            // Image is taller - fit to width
            drawWidth = overlayWidth
            drawHeight = overlayWidth / imageAspect
            drawY = overlayY - (drawHeight - overlayHeight) / 2
          }
          
          // Clip to overlay area
          ctx.save()
          ctx.beginPath()
          ctx.rect(overlayX, overlayY, overlayWidth, overlayHeight)
          ctx.clip()
        }
        
        // Draw custom image
        ctx.drawImage(customImage, drawX, drawY, drawWidth, drawHeight)
        
        if (overlayConfig.fit === 'cover') {
          ctx.restore()
        }
        
        // Convert to data URL
        try {
          const compositeUrl = canvas.toDataURL('image/png', 0.9)
          resolve(compositeUrl)
        } catch (error) {
          reject(error)
        }
      }
      
      customImage.onerror = (error) => {
        console.error('Custom image load error:', error)
        reject(new Error('Failed to load custom image'))
      }
      
      customImage.src = customImageUrl
    }
    
    baseImage.onerror = (error) => {
      console.error('Base image load error:', error, 'URL:', baseImageUrl)
      reject(new Error('Failed to load base image'))
    }
    
    baseImage.src = baseImageUrl
  })
}
