import Link from 'next/link'
import Image from 'next/image'

// Database product type
type DatabaseProduct = {
  id: number;
  name: string;
  category: string;
  images: string[];
};

// Homepage product type
type Product = {
  id: string;
  name: string;
  mainImage: string;
};

type ProductsByCategory = {
  [category: string]: Product[];
};

// Fetch products from the API (which connects to database)
async function getAllProductsByCategory(): Promise<ProductsByCategory> {
  const productsByCategory: ProductsByCategory = {};
  
  try {
    // Use absolute URL for server-side fetching
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3060';
    
    const response = await fetch(`${baseUrl}/api/products`, {
      // Disable caching to always get fresh data
      cache: 'no-store'
    });
    
    if (response.ok) {
      const products: DatabaseProduct[] = await response.json();
      
      // Group products by category
      for (const product of products) {
        const category = product.category;
        if (!productsByCategory[category]) {
          productsByCategory[category] = [];
        }
        
        // Use first image as main image, fallback to placeholder
        const mainImage = product.images && product.images.length > 0 
          ? product.images[0] 
          : '/placeholder-product.jpg';
        
        productsByCategory[category].push({
          id: product.id.toString(),
          name: product.name,
          mainImage: mainImage,
        });
      }
      
      return productsByCategory;
    }
  } catch (error) {
    console.error('Error fetching products from API:', error);
  }

  // Fallback: return empty object if API fails
  return productsByCategory;
}

export default async function Home() {
  const productsByCategory = await getAllProductsByCategory();
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
