import { create } from 'zustand'

interface DesignData {
  images: any[]
  texts: any[]
  canvasWidth: number
  canvasHeight: number
}

interface DesignStore {
  designImageUrl: string | null
  designData: DesignData | null
  productId: string | null
  setDesign: (imageUrl: string, data: DesignData, productId: string) => void
  clearDesign: () => void
}

export const useDesignStore = create<DesignStore>((set) => ({
  designImageUrl: null,
  designData: null,
  productId: null,
  setDesign: (imageUrl, data, productId) => 
    set({ designImageUrl: imageUrl, designData: data, productId }),
  clearDesign: () => 
    set({ designImageUrl: null, designData: null, productId: null })
}))
