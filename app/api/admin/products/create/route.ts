import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const supabase = await createClient()

    // Extract form data
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string
    const stock = parseInt(formData.get('stock') as string)
    const customizable = formData.get('customizable') === 'true'
    const featured = formData.get('featured') === 'true'
    const default_color = formData.get('default_color') as string
    const available_colors = JSON.parse(formData.get('available_colors') as string)

    // Upload product images to Supabase Storage
    const imageUrls: string[] = []
    let imageIndex = 0
    
    while (formData.has(`productImage${imageIndex}`)) {
      const imageFile = formData.get(`productImage${imageIndex}`) as File
      
      if (imageFile) {
        const timestamp = Date.now()
        const fileName = `${name.replace(/\s+/g, '-').toLowerCase()}-${timestamp}-${imageIndex}.${imageFile.name.split('.').pop()}`
        const filePath = `products/${fileName}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
            upsert: false,
          })
        
        if (uploadError) {
          console.error('Image upload error:', uploadError)
          throw new Error(`Failed to upload image ${imageIndex + 1}`)
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        
        imageUrls.push(publicUrl)
      }
      
      imageIndex++
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one product image is required' },
        { status: 400 }
      )
    }

    // Upload template image if customizable
    let templateImageUrl: string | null = null
    
    if (customizable) {
      const templateFile = formData.get('templateImage') as File
      
      if (!templateFile) {
        return NextResponse.json(
          { error: 'Template image is required for customizable products' },
          { status: 400 }
        )
      }
      
      const timestamp = Date.now()
      const fileName = `${name.replace(/\s+/g, '-').toLowerCase()}-template-${timestamp}.png`
      const filePath = `templates/${fileName}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-templates')
        .upload(filePath, templateFile, {
          contentType: 'image/png',
          upsert: false,
        })
      
      if (uploadError) {
        console.error('Template upload error:', uploadError)
        throw new Error('Failed to upload template image')
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-templates')
        .getPublicUrl(filePath)
      
      templateImageUrl = publicUrl
    }

    // Create product in database
    const { data: product, error: dbError } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price,
        category,
        stock,
        customizable,
        featured,
        default_color,
        available_colors,
        images: imageUrls,
        template_image: templateImageUrl,
        theme_tags: [],
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to create product in database')
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    )
  }
}
