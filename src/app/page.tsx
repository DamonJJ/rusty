import Link from 'next/link'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'

// Function to get all products from the public/products directory
function getAllProducts() {
  const products = []
  const productsPath = path.join(process.cwd(), 'public', 'products')
  
  try {
    // Get all category folders
    const categories = fs.readdirSync(productsPath)
    
    for (const category of categories) {
      const categoryPath = path.join(productsPath, category)
      
      // Get all product folders in this category
      const productFolders = fs.readdirSync(categoryPath)
        .filter(item => fs.statSync(path.join(categoryPath, item)).isDirectory())
      
      for (const productFolder of productFolders) {
        const productPath = path.join(categoryPath, productFolder)
        
        // Get the first image as the main image
        const files = fs.readdirSync(productPath)
        const mainImage = files.find(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        
        if (mainImage) {
          products.push({
            id: productFolder,
            category,
            name: productFolder.replace(/-/g, ' '),
            mainImage: `/products/${category}/${productFolder}/${mainImage}`
          })
        }
      }
    }
  } catch (error) {
    console.error('Error reading products:', error)
  }
  
  return products
}

export default function Home() {
  const products = getAllProducts()

  return (
    <main className="min-h-screen p-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="mb-6">
          <Image
            src="/logo.jpg"
            alt="Rusty Nuts - Small Engine Repair"
            width={300}
            height={150}
            className="mx-auto"
            priority
          />
        </div>
        <p className="text-2xl text-amber-800/80 mb-8 font-medium">
          Small Engine Repair
        </p>
        <div className="h-1 w-40 bg-amber-900/20 mx-auto"></div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={`${product.category}-${product.id}`}
              href={`/products/${product.category}/${product.id}`}
              className="group rustic-card rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video bg-gray-100 relative">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold capitalize mb-2 text-amber-900">
                  {product.name}
                </h3>
                <p className="text-amber-800/70 capitalize flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-800/30"></span>
                  {product.category.replace(/-/g, ' ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
