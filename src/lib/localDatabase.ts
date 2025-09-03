// Local development database using JSON file
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'public', 'data', 'products.json')

export interface LocalProduct {
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

export interface DatabaseProduct {
  id: number
  name: string
  category: string
  description?: string
  price?: number
  condition?: string
  year?: number
  make?: string
  model?: string
  images: string[]
  contact_phone: string
  contact_email: string
  created_at: string
  updated_at: string
}

function readLocalDatabase(): LocalProduct[] {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading local database:', error)
    return []
  }
}

function writeLocalDatabase(products: LocalProduct[]): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2))
  } catch (error) {
    console.error('Error writing local database:', error)
  }
}

function convertLocalToDatabase(localProduct: LocalProduct, index: number): DatabaseProduct {
  // Use the original ID if it's a string, otherwise create a numeric ID
  const id = isNaN(parseInt(localProduct.id)) ? (index + 1) : parseInt(localProduct.id)
  
  return {
    id: id,
    name: localProduct.name,
    category: localProduct.category,
    description: localProduct.description,
    price: localProduct.price ? parseFloat(localProduct.price) : undefined,
    condition: localProduct.condition,
    year: localProduct.year ? parseInt(localProduct.year) : undefined,
    make: localProduct.make,
    model: localProduct.model,
    images: localProduct.images,
    contact_phone: localProduct.contactPhone,
    contact_email: localProduct.contactEmail,
    created_at: localProduct.lastUpdated,
    updated_at: localProduct.lastUpdated
  }
}

function convertDatabaseToLocal(dbProduct: DatabaseProduct): LocalProduct {
  return {
    id: dbProduct.id.toString(),
    name: dbProduct.name,
    category: dbProduct.category,
    description: dbProduct.description,
    price: dbProduct.price?.toString(),
    condition: dbProduct.condition,
    year: dbProduct.year?.toString(),
    make: dbProduct.make,
    model: dbProduct.model,
    images: dbProduct.images,
    contactPhone: dbProduct.contact_phone,
    contactEmail: dbProduct.contact_email,
    lastUpdated: dbProduct.updated_at
  }
}

export function getAllProducts(): DatabaseProduct[] {
  const localProducts = readLocalDatabase()
  return localProducts.map(convertLocalToDatabase)
}

export function getProductById(id: number): DatabaseProduct | null {
  const products = getAllProducts()
  return products.find(p => p.id === id) || null
}

export function createProduct(productData: Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>): DatabaseProduct {
  const localProducts = readLocalDatabase()
  const newId = Math.max(...localProducts.map(p => parseInt(p.id)), 0) + 1
  
  const newLocalProduct: LocalProduct = convertDatabaseToLocal({
    ...productData,
    id: newId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
  
  localProducts.push(newLocalProduct)
  writeLocalDatabase(localProducts)
  
  return convertLocalToDatabase(newLocalProduct, localProducts.length - 1)
}

export function updateProduct(id: number, productData: Partial<Omit<DatabaseProduct, 'id' | 'created_at'>>): DatabaseProduct | null {
  const localProducts = readLocalDatabase()
  const index = localProducts.findIndex(p => parseInt(p.id) === id)
  
  if (index === -1) return null
  
  const existingProduct = localProducts[index]
  const updatedLocalProduct: LocalProduct = {
    ...existingProduct,
    ...convertDatabaseToLocal({
      ...convertLocalToDatabase(existingProduct, index),
      ...productData,
      updated_at: new Date().toISOString()
    })
  }
  
  localProducts[index] = updatedLocalProduct
  writeLocalDatabase(localProducts)
  
  return convertLocalToDatabase(updatedLocalProduct, index)
}

export function deleteProduct(id: number): boolean {
  const localProducts = readLocalDatabase()
  const index = localProducts.findIndex(p => parseInt(p.id) === id)
  
  if (index === -1) return false
  
  localProducts.splice(index, 1)
  writeLocalDatabase(localProducts)
  
  return true
}
