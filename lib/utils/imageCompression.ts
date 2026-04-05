/**
 * Compress a base64 image to reduce file size for storage
 * @param base64 - The base64 image string (data:image/png;base64,...)
 * @param maxWidth - Maximum width of the compressed image
 * @param quality - JPEG quality (0-1)
 * @returns Compressed base64 image string
 */
export async function compressBase64Image(
  base64: string,
  maxWidth: number = 600,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let width = img.width
      let height = img.height
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      // Create canvas
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to JPEG for better compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = base64
  })
}
