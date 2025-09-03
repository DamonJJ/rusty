'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  category: string
  description?: string
  price?: string
  condition?: string
  year?: string
  make?: string
  model?: string
  images: string[]
  contactPhone: string
  contactEmail: string
  lastUpdated: string
}

interface PageProps {
  params: Promise<{
    category: string
  }>
}

export default function ProductCategoryPage({ params }: PageProps) {
  const [category, setCategory] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params
        const { category: categoryParam } = resolvedParams
        
        setCategory(categoryParam)
        
        // Fetch products from our API
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const allProducts = await response.json()
        
        // Filter products by category and convert to component format
        const categoryProducts = allProducts
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((p: any) => p.category === categoryParam)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((p: any) => ({
            id: p.id.toString(),
            name: p.name,
            category: p.category,
            description: p.description,
            price: p.price?.toString(),
            condition: p.condition,
            year: p.year?.toString(),
            make: p.make,
            model: p.model,
            images: p.images || [],
            contactPhone: p.contact_phone,
            contactEmail: p.contact_email,
            lastUpdated: p.updated_at
          }))
        
        setProducts(categoryProducts)
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 capitalize">{category}</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found in this category.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{category}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const mainImage = product.images.length > 0 ? product.images[0] : ''

          return (
            <Link
              key={product.id}
              href={`/products/${category}/${product.id}`}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <div className="aspect-video bg-gray-100 relative">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4 bg-white">
                <h2 className="text-xl font-semibold capitalize">
                  {product.name}
                </h2>
                {product.price && (
                  <p className="text-lg font-medium text-green-600 mt-2">
                    ${parseFloat(product.price || '0').toLocaleString()}
                  </p>
                )}
                {product.year && product.make && (
                  <p className="text-sm text-gray-600 mt-1">
                    {product.year} {product.make}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 