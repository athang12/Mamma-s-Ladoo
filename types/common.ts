// Common utility types
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ImageUpload {
  file: File
  preview: string
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number
  url?: string
}
