import { NextRequest, NextResponse } from 'next/server'

// Try to import Vercel SQL, but fall back to local database if not available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sql: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const vercelPostgres = require('@vercel/postgres')
  sql = vercelPostgres.sql
} catch {
  console.log('Vercel Postgres not available, using local database')
}

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const productId = parseInt(id)
  
  // Try database first, fall back to local JSON
  if (sql && process.env.POSTGRES_URL) {
    try {
      const { rows } = await sql`
        SELECT * FROM products WHERE id = ${productId}
      `
      
      if (rows.length === 0) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      // Parse images array from PostgreSQL JSON string
      const product = {
        ...rows[0],
        images: Array.isArray(rows[0].images) ? rows[0].images : (rows[0].images || [])
      }

      return NextResponse.json(product)
    } catch (error) {
      console.error('Database error, falling back to local:', error)
    }
  }
  
  // Use local database
  try {
    const { getProductById } = await import('@/lib/localDatabase')
    const product = getProductById(productId)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const productId = parseInt(id)
  
  try {
    const body = await request.json()
    const {
      name,
      category,
      description,
      price,
      condition,
      year,
      make,
      model,
      images,
      contactPhone,
      contactEmail
    } = body

    // Try database first, fall back to local JSON
    if (sql && process.env.POSTGRES_URL) {
      try {
        const { rows } = await sql`
          UPDATE products SET
            name = ${name},
            category = ${category},
            description = ${description},
            price = ${price},
            condition = ${condition},
            year = ${year},
            make = ${make},
            model = ${model},
            images = ${images},
            contact_phone = ${contactPhone},
            contact_email = ${contactEmail},
            updated_at = NOW()
          WHERE id = ${productId}
          RETURNING *
        `

        if (rows.length === 0) {
          return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
          )
        }

        return NextResponse.json(rows[0])
      } catch (error) {
        console.error('Database error, falling back to local:', error)
      }
    }

    // Use local database
    const { updateProduct } = await import('@/lib/localDatabase')
    const updatedProduct = updateProduct(productId, {
      name,
      category,
      description,
      price,
      condition,
      year,
      make,
      model,
      images: images || [],
      contact_phone: contactPhone,
      contact_email: contactEmail
    })

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const productId = parseInt(id)
  
  try {
    // Try database first, fall back to local JSON
    if (sql && process.env.POSTGRES_URL) {
      try {
        const { rows } = await sql`
          DELETE FROM products WHERE id = ${productId} RETURNING *
        `

        if (rows.length === 0) {
          return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ message: 'Product deleted successfully' })
      } catch (error) {
        console.error('Database error, falling back to local:', error)
      }
    }

    // Use local database
    const { deleteProduct } = await import('@/lib/localDatabase')
    const deleted = deleteProduct(productId)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
} 