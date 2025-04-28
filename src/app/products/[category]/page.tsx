import fs from 'fs'
import path from 'path'

export async function generateStaticParams() {
  const productsDir = path.join(process.cwd(), 'public', 'products')
  const categories = fs.readdirSync(productsDir)
  let params: { category: string; product: string }[] = []

  for (const category of categories) {
    const categoryDir = path.join(productsDir, category)
    if (!fs.statSync(categoryDir).isDirectory()) continue
    const products = fs.readdirSync(categoryDir)
    for (const product of products) {
      const productDir = path.join(categoryDir, product)
      if (fs.statSync(productDir).isDirectory()) {
        params.push({ category, product })
      }
    }
  }
  return params
}

import { notFound } from 'next/navigation'
import Link from 'next/link'

// Validate category parameter
const validCategories = ['snowmobiles', 'trailers']

interface PageProps {
  params: Promise<{
    category: string
  }>
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { category } = await params

  if (!validCategories.includes(category)) {
    notFound()
  }

  // Function to get product folders
  const getProductFolders = () => {
    const productsPath = path.join(process.cwd(), 'public', 'products', category)
    
    try {
      return fs.readdirSync(productsPath)
        .filter(item => {
          const itemPath = path.join(productsPath, item)
          return fs.statSync(itemPath).isDirectory()
        })
    } catch (error) {
      console.error('Error reading product folders:', error)
      return []
    }
  }

  // Get all product folders
  const products = getProductFolders()

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{category}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((productFolder) => {
          // Get the first image as the main image
          const productPath = path.join(process.cwd(), 'public', 'products', category, productFolder)
          let mainImage = ''
          
          try {
            const files = fs.readdirSync(productPath)
            const imageFile = files.find(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            if (imageFile) {
              mainImage = `/products/${category}/${productFolder}/${imageFile}`
            }
          } catch (error) {
            console.error('Error reading product images:', error)
          }

          return (
            <Link
              key={productFolder}
              href={`/products/${category}/${productFolder}`}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <div className="aspect-video bg-gray-100 relative">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={productFolder}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4 bg-white">
                <h2 className="text-xl font-semibold capitalize">
                  {productFolder.replace(/-/g, ' ')}
                </h2>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 