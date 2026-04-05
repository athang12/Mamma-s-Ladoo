export const SHIPPING_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 999, // Free shipping above ₹999
  STANDARD_SHIPPING_COST: 50,
  COD_CHARGES: 50,
}

export const TAX_RATE = 0.18 // 18% GST

export const CURRENCY = {
  symbol: '₹',
  code: 'INR',
  locale: 'en-IN',
}

export const FONT_OPTIONS = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { name: 'Impact', value: 'Impact, fantasy' },
  { name: 'Brush Script', value: '"Brush Script MT", cursive' },
  { name: 'Pacifico', value: '"Pacifico", cursive' },
  { name: 'Dancing Script', value: '"Dancing Script", cursive' },
]

export const IMAGE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_WIDTH: 4000,
  MAX_HEIGHT: 4000,
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
}
