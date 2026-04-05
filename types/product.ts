// Product type definitions
import type { ThemeName } from './theme'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  productType: ProductType
  productCategory: 'prebuilt' | 'custom'
  themeTags: ThemeName[]
  basePrice: number
  availableColors: ProductColor[]
  defaultColor: string
  images: ProductImage[]
  thumbnailUrl: string
  customizationArea?: CustomizationArea
  sizes?: ProductSize[]
  stock: number
  featured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProductType = 
  | 'coffee-mug'
  | 'jigsaw-puzzle'
  | 'handkerchief'
  | 'zipper-tote-bag'
  | 'daily-planner'
  | 'acrylic-stand'
  | 'wall-frame'
  | 'fridge-magnet'

export interface ProductColor {
  name: string
  hex: string
  imageUrl: string
}

export interface ProductImage {
  url: string
  alt: string
  isPrimary: boolean
}

export interface ProductSize {
  name: string
  displayName: string
  priceAdjustment: number
}

export interface CustomizationArea {
  x: number
  y: number
  width: number
  height: number
  shape: 'rectangle' | 'circle' | 'custom'
}
