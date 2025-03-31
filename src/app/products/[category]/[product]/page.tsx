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
    <div className="p-8 bg-[#f8f5f1]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 capitalize text-amber-900 rustic-header font-serif">
          {product.replace(/-/g, ' ')}
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
                <p className="text-amber-800/80">
                  Contact us for more information about this {category.slice(0, -1)}.
                </p>
                
                {/* Contact Information */}
                <div className="border-t border-amber-900/10 pt-4">
                  <h3 className="text-lg font-medium text-amber-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-amber-800/80">
                    <p className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>(555) 123-4567</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>contact@rustynuts.com</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>123 Workshop Lane, Snowville, MN 55555</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contact Buttons */}
              <div className="space-y-3">
                <a 
                  href="tel:5551234567"
                  className="block w-full py-3 px-6 text-center rounded-lg bg-amber-900 text-white hover:bg-amber-800 transition-colors font-medium"
                >
                  Call Now
                </a>
                <a 
                  href="mailto:contact@rustynuts.com?subject=Inquiry about {product}"
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