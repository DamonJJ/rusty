'use client'

import { useEffect, useState } from 'react'
import ImageGallery from '@/components/ImageGallery'

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
    product: string
  }>
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params
        const { product: productId } = resolvedParams
        
        // Fetch product from our API using numeric ID
        const response = await fetch(`/api/products/${productId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found')
          } else {
            setError('Failed to load product data')
          }
          return
        }
        
        const productData = await response.json()
        
        // Convert database format to component format
        const product: Product = {
          id: productData.id.toString(),
          name: productData.name,
          category: productData.category,
          description: productData.description,
          price: productData.price?.toString(),
          condition: productData.condition,
          year: productData.year?.toString(),
          make: productData.make,
          model: productData.model,
          images: productData.images || [],
          contactPhone: productData.contact_phone,
          contactEmail: productData.contact_email,
          lastUpdated: productData.updated_at
        }
        
        setProduct(product)
      } catch (err) {
        console.error('Error loading product:', err)
        setError('Failed to load product data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-[#f8f5f1]">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="space-y-6">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen p-8 bg-[#f8f5f1]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h1>
            <p className="text-gray-600">{error || 'Product not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const images = product.images.map((src, index) => ({
    src,
    alt: `${product.name} - Image ${index + 1}`
  }))

  return (
    <div className="min-h-screen p-8 bg-[#f8f5f1]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 capitalize text-amber-900 rustic-header font-serif">
          {product.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="w-full">
            <ImageGallery images={images} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="rustic-card p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-amber-900">Details</h2>
              
              {/* Product Information */}
              <div className="space-y-4 mb-6">
                {product.description && (
                  <p className="text-amber-800/80">{product.description}</p>
                )}
                
                {/* Product Specifications */}
                <div className="grid grid-cols-2 gap-4">
                  {product.price && (
                    <div>
                      <span className="font-medium text-amber-900">Price:</span>
                      <p className="text-lg font-bold text-green-600">
                        ${parseFloat(product.price || '0').toLocaleString()}
                      </p>
                    </div>
                  )}
                  {product.condition && (
                    <div>
                      <span className="font-medium text-amber-900">Condition:</span>
                      <p className="text-amber-800/80">{product.condition}</p>
                    </div>
                  )}
                  {product.year && (
                    <div>
                      <span className="font-medium text-amber-900">Year:</span>
                      <p className="text-amber-800/80">{product.year}</p>
                    </div>
                  )}
                  {product.make && (
                    <div>
                      <span className="font-medium text-amber-900">Make:</span>
                      <p className="text-amber-800/80">{product.make}</p>
                    </div>
                  )}
                  {product.model && (
                    <div>
                      <span className="font-medium text-amber-900">Model:</span>
                      <p className="text-amber-800/80">{product.model}</p>
                    </div>
                  )}
                </div>
                
                {/* Contact Information */}
                <div className="border-t border-amber-900/10 pt-4">
                  <h3 className="text-lg font-medium text-amber-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-amber-800/80">
                    <p className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{product.contactPhone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{product.contactEmail}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Open Sunday - Thursday: 8am - 5pm</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contact Buttons */}
              <div className="space-y-3">
                <a 
                  href={`tel:${product.contactPhone.replace(/\D/g, '')}`}
                  className="block w-full py-3 px-6 text-center rounded-lg bg-amber-900 text-white hover:bg-amber-800 transition-colors font-medium"
                >
                  Call Now: {product.contactPhone}
                </a>
                <a 
                  href={`mailto:${product.contactEmail}?subject=Inquiry about ${product.name}`}
                  className="block w-full py-3 px-6 text-center rounded-lg border-2 border-amber-900 text-amber-900 hover:bg-amber-900/5 transition-colors font-medium"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 