import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/localDatabase'

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

// GET - Fetch all products
export async function GET() {
  // Try database first, fall back to local JSON
  if (sql && process.env.POSTGRES_URL) {
    try {
      const { rows } = await sql`
        SELECT * FROM products 
        ORDER BY created_at DESC
      `
      
      // Parse images arrays from PostgreSQL JSON strings
      const processedRows = rows.map((row: any) => ({
        ...row,
        images: Array.isArray(row.images) ? row.images : (row.images || [])
      }))
      
      return NextResponse.json(processedRows)
    } catch (error) {
      console.error('Database error, falling back to local:', error)
    }
  }
  
  // Use local database
  try {
    console.log('Attempting to use local database...')
    const products = getAllProducts()
    console.log('Successfully got products:', products.length)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products from local database:', error)
    
    // Final fallback - try to read the JSON file directly
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path')
      const DB_PATH = path.join(process.cwd(), 'public', 'data', 'products.json')
      
      if (fs.existsSync(DB_PATH)) {
        const data = fs.readFileSync(DB_PATH, 'utf8')
        const localProducts = JSON.parse(data)
        
        // Convert to database format quickly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const products = localProducts.map((p: Record<string, any>, index: number) => ({
          id: index + 1,
          name: p.name,
          category: p.category,
          description: p.description,
          price: p.price ? parseFloat(p.price) : null,
          condition: p.condition,
          year: p.year ? parseInt(p.year) : null,
          make: p.make,
          model: p.model,
          images: p.images || [],
          contact_phone: p.contactPhone || '(715) 430-2201',
          contact_email: p.contactEmail || 'vern@rustynuts.repair',
          created_at: p.lastUpdated || new Date().toISOString(),
          updated_at: p.lastUpdated || new Date().toISOString()
        }))
        
        return NextResponse.json(products)
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
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
          INSERT INTO products (
            name, category, description, price, condition, 
            year, make, model, images, contact_phone, contact_email
          ) VALUES (
            ${name}, ${category}, ${description}, ${price}, ${condition},
            ${year}, ${make}, ${model}, ${images}, ${contactPhone}, ${contactEmail}
          ) RETURNING *
        `
        return NextResponse.json(rows[0])
      } catch (error) {
        console.error('Database error, falling back to local:', error)
      }
    }

    // Use local database
    const { createProduct } = await import('@/lib/localDatabase')
    const newProduct = createProduct({
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

    return NextResponse.json(newProduct)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
} 