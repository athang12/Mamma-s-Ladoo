import { ProductType } from '@/types/product'

export const PRODUCT_TYPES: Record<ProductType, {
  id: ProductType
  displayName: string
  description: string
  hasSize: boolean
  sizeOptions?: Array<{ name: string; displayName: string; priceAdjustment: number }>
  availableColors: Array<{ name: string; hex: string }>
}> = {
  'coffee-mug': {
    id: 'coffee-mug',
    displayName: 'Coffee Mug',
    description: 'Perfect for your morning coffee or tea',
    hasSize: true,
    sizeOptions: [
      { name: '11oz', displayName: '11oz (Standard)', priceAdjustment: 0 },
      { name: '15oz', displayName: '15oz (Large)', priceAdjustment: 50 },
    ],
    availableColors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Red', hex: '#DC143C' },
      { name: 'Blue', hex: '#1E90FF' },
      { name: 'Pink', hex: '#FF69B4' },
    ],
  },
  
  'jigsaw-puzzle': {
    id: 'jigsaw-puzzle',
    displayName: 'Jigsaw Puzzle',
    description: 'Custom puzzles for fun and memories',
    hasSize: true,
    sizeOptions: [
      { name: '252pc', displayName: '252 Pieces', priceAdjustment: 0 },
      { name: '500pc', displayName: '500 Pieces', priceAdjustment: 100 },
      { name: '1000pc', displayName: '1000 Pieces', priceAdjustment: 200 },
    ],
    availableColors: [
      { name: 'Standard', hex: '#FFFFFF' },
    ],
  },
  
  'handkerchief': {
    id: 'handkerchief',
    displayName: 'Handkerchief',
    description: 'Soft fabric handkerchief with custom design',
    hasSize: false,
    availableColors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Blue', hex: '#ADD8E6' },
      { name: 'Pink', hex: '#FFB6C1' },
      { name: 'Yellow', hex: '#FFFFE0' },
    ],
  },
  
  'zipper-tote-bag': {
    id: 'zipper-tote-bag',
    displayName: 'Zipper Tote Bag',
    description: 'Durable tote bag with zipper closure',
    hasSize: false,
    availableColors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Beige', hex: '#F5F5DC' },
      { name: 'Khaki', hex: '#C3B091' },
    ],
  },
  
  'daily-planner': {
    id: 'daily-planner',
    displayName: 'Daily Planner',
    description: 'Organize your day with style',
    hasSize: true,
    sizeOptions: [
      { name: 'a5', displayName: 'A5 (Compact)', priceAdjustment: 0 },
      { name: 'a4', displayName: 'A4 (Standard)', priceAdjustment: 75 },
    ],
    availableColors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Pastel Pink', hex: '#FFB6C1' },
      { name: 'Pastel Blue', hex: '#ADD8E6' },
    ],
  },
  
  'acrylic-stand': {
    id: 'acrylic-stand',
    displayName: 'Acrylic Stand',
    description: 'Transparent acrylic display stand',
    hasSize: false,
    availableColors: [
      { name: 'Clear', hex: '#F0F0F0' },
    ],
  },
  
  'wall-frame': {
    id: 'wall-frame',
    displayName: 'Wall Frame',
    description: 'Modern acrylic wall frame',
    hasSize: true,
    sizeOptions: [
      { name: 'small', displayName: '8x10"', priceAdjustment: 0 },
      { name: 'medium', displayName: '11x14"', priceAdjustment: 100 },
      { name: 'large', displayName: '16x20"', priceAdjustment: 200 },
    ],
    availableColors: [
      { name: 'Clear', hex: '#F0F0F0' },
    ],
  },
  
  'fridge-magnet': {
    id: 'fridge-magnet',
    displayName: 'Fridge Magnet',
    description: 'Custom acrylic fridge magnets',
    hasSize: false,
    availableColors: [
      { name: 'Clear', hex: '#F0F0F0' },
    ],
  },
}

export const BASE_PRICES: Record<ProductType, number> = {
  'coffee-mug': 299,
  'jigsaw-puzzle': 499,
  'handkerchief': 199,
  'zipper-tote-bag': 449,
  'daily-planner': 399,
  'acrylic-stand': 249,
  'wall-frame': 349,
  'fridge-magnet': 149,
}

export const CUSTOMIZATION_AREAS: Record<ProductType, {
  x: number
  y: number
  width: number
  height: number
  shape: 'rectangle' | 'circle' | 'custom'
}> = {
  'coffee-mug': { x: 50, y: 50, width: 200, height: 150, shape: 'rectangle' },
  'jigsaw-puzzle': { x: 0, y: 0, width: 300, height: 300, shape: 'rectangle' },
  'handkerchief': { x: 25, y: 25, width: 150, height: 150, shape: 'rectangle' },
  'zipper-tote-bag': { x: 75, y: 100, width: 200, height: 250, shape: 'rectangle' },
  'daily-planner': { x: 50, y: 50, width: 150, height: 200, shape: 'rectangle' },
  'acrylic-stand': { x: 50, y: 50, width: 150, height: 150, shape: 'rectangle' },
  'wall-frame': { x: 50, y: 50, width: 200, height: 200, shape: 'rectangle' },
  'fridge-magnet': { x: 25, y: 25, width: 80, height: 80, shape: 'circle' },
}
