import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    const supabase = await createClient()
    const body = await request.json()

    const updates = {
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      category: body.category,
      stock: Number(body.stock),
      featured: Boolean(body.featured),
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, product: data })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    const supabase = await createClient()

    // Get product to find associated images
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('images, template_image')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product from database first
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      )
    }

    // Delete associated images from storage (best effort, don't fail if images missing)
    try {
      // Delete product images
      if (product.images && product.images.length > 0) {
        const imagePaths = product.images
          .map((url: string) => {
            const match = url.match(/product-images\/(.+)$/)
            return match ? match[1] : null
          })
          .filter(Boolean) as string[]

        if (imagePaths.length > 0) {
          await supabase.storage
            .from('product-images')
            .remove(imagePaths)
        }
      }

      // Delete template image if exists
      if (product.template_image) {
        const match = product.template_image.match(/product-templates\/(.+)$/)
        if (match) {
          await supabase.storage
            .from('product-templates')
            .remove([match[1]])
        }
      }
    } catch (storageError) {
      console.warn('Error deleting storage files:', storageError)
      // Continue anyway, product is already deleted from database
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
