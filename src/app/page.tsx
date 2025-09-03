import Link from 'next/link'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'

// Function to get all products from the JSON database
type Product = {
  id: string;
  name: string;
  mainImage: string;
};

type ProductsByCategory = {
  [category: string]: Product[];
};

function getAllProductsByCategory(): ProductsByCategory {
  const productsByCategory: ProductsByCategory = {};
  
  try {
    // Read from JSON database first
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'products.json');
    
    if (fs.existsSync(jsonPath)) {
      const data = fs.readFileSync(jsonPath, 'utf8');
      const products = JSON.parse(data);
      
      // Group products by category
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const category = product.category;
        if (!productsByCategory[category]) {
          productsByCategory[category] = [];
        }
        
        // Use first image as main image, fallback to placeholder
        const mainImage = product.images && product.images.length > 0 
          ? product.images[0] 
          : '/placeholder-product.jpg';
        
        // Use index + 1 as numeric ID to match what the API expects
        productsByCategory[category].push({
          id: (i + 1).toString(),
          name: product.name,
          mainImage: mainImage,
        });
      }
      
      return productsByCategory;
    }
  } catch (error) {
    console.error('Error reading JSON database:', error);
  }

  // Fallback to original file system method if JSON doesn't exist
  const productsPath = path.join(process.cwd(), 'public', 'products');

  try {
    // Get all category folders
    const categories = fs.readdirSync(productsPath);

    for (const category of categories) {
      const categoryPath = path.join(productsPath, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;
      // Get all product folders in this category
      const productFolders = fs.readdirSync(categoryPath)
        .filter(item => fs.statSync(path.join(categoryPath, item)).isDirectory());

      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      
      for (const productFolder of productFolders) {
        const productPath = path.join(categoryPath, productFolder);
        // Get the first image as the main image
        const files = fs.readdirSync(productPath);
        const mainImage = files.find(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        if (mainImage) {
          productsByCategory[category].push({
            id: productFolder,
            name: productFolder.replace(/-/g, ' '),
            mainImage: `/products/${category}/${productFolder}/${mainImage}`,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error reading products from filesystem:', error);
  }

  return productsByCategory;
}

export default function Home() {
  const productsByCategory = getAllProductsByCategory();
  const categories = Object.keys(productsByCategory);

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
        
        {/* Admin Link */}
        <div className="mt-8">
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      </div>

      {/* Products by Category Section */}
      <div className="max-w-7xl mx-auto space-y-16">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-3xl font-bold mb-6 capitalize text-amber-900 rustic-header font-serif">
              {category.replace(/-/g, ' ')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productsByCategory[category].map((product) => (
                <Link
                  key={`${category}-${product.id}`}
                  href={`/products/${category}/${product.id}`}
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
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
