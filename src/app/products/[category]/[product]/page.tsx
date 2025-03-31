import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import ImageGallery from '@/components/ImageGallery'

interface PageProps {
  params: Promise<{
    category: string
    product: string
  }>
}

export default async function ProductPage({ params }: PageProps) {
  const { category, product } = await params
  
  // Validate category
  const validCategories = ['snowmobiles', 'trailers']
  if (!validCategories.includes(category)) {
    notFound()
  }

  // Get product images
  const productPath = path.join(process.cwd(), 'public', 'products', category, product)
  let images: { src: string; alt: string }[] = []

  try {
    const files = fs.readdirSync(productPath)
    images = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => ({
        src: `/products/${category}/${product}/${file}`,
        alt: file.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')
      }))
  } catch (error) {
    console.error('Error reading product images:', error)
    notFound()
  }

  if (images.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 capitalize">
          {product.replace(/-/g, ' ')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="w-full">
            <ImageGallery images={images} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Details</h2>
              <p className="text-gray-600">
                Contact us for more information about this {category.slice(0, -1)}.
              </p>
              
              {/* Contact Button */}
              <button className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Contact About This {category.slice(0, -1)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 