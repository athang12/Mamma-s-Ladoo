import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Browser client for client-side operations
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Default client instance for direct use
export const supabase = createClient()

// Storage helper functions
export const getStorageUrl = (path: string) => {
  return `${supabaseUrl}/storage/v1/object/public/custom-images/${path}`
}

export const uploadCustomImage = async (file: File | Blob, filename: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('custom-images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    return {
      path: data.path,
      url: getStorageUrl(data.path),
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const uploadCustomImageFromDataURL = async (dataUrl: string, filename: string) => {
  try {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    return await uploadCustomImage(blob, filename)
  } catch (error) {
    console.error('Error uploading image from data URL:', error)
    throw error
  }
}

export const deleteCustomImage = async (path: string) => {
  try {
    const { error } = await supabase.storage
      .from('custom-images')
      .remove([path])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}
