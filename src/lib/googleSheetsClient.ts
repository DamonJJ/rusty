// Client-side Google Sheets integration for product management
// This works with static hosting and allows non-technical users to update products

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  price?: string;
  condition?: string;
  year?: string;
  make?: string;
  model?: string;
  images: string[];
  contactPhone: string;
  contactEmail: string;
  lastUpdated: string;
}

class GoogleSheetsClient {
  private apiKey: string;
  private spreadsheetId: string;
  private sheetName: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || '';
    this.spreadsheetId = process.env.NEXT_PUBLIC_PRODUCTS_SPREADSHEET_ID || '';
    this.sheetName = 'Products'; // Name of your sheet tab
  }

  async getProducts(): Promise<Product[]> {
    try {
      // Direct API call from browser to Google Sheets
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.sheetName}!A2:Z?key=${this.apiKey}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch from Google Sheets: ${response.status}`);
      }

      const data = await response.json();
      const values = data.values;

      if (!values || values.length === 0) {
        throw new Error('No data found in spreadsheet');
      }

      // Convert spreadsheet rows to Product objects
      const products: Product[] = values.map((row: string[]) => {
        // Expected columns: id, name, category, description, price, condition, year, make, model, images, contactPhone, contactEmail, lastUpdated
        return {
          id: row[0] || '',
          name: row[1] || '',
          category: row[2] || '',
          description: row[3] || '',
          price: row[4] || '',
          condition: row[5] || '',
          year: row[6] || '',
          make: row[7] || '',
          model: row[8] || '',
          images: row[9] ? row[9].split(',').map((img: string) => img.trim()) : [],
          contactPhone: row[10] || '(715) 430-2201',
          contactEmail: row[11] || 'vern@rustynuts.repair',
          lastUpdated: row[12] || new Date().toISOString().split('T')[0]
        };
      }).filter((product: Product) => product.id && product.name && product.category);

      return products;
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      // Fallback to static data
      return this.getFallbackProducts();
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(product => product.id === id) || null;
  }

  private async getFallbackProducts(): Promise<Product[]> {
    try {
      // Fallback to static JSON file
      const response = await fetch('/data/products.json');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error loading fallback products:', error);
    }

    // Return empty array if all fallbacks fail
    return [];
  }

  // Helper method to get unique categories
  async getCategories(): Promise<string[]> {
    const products = await this.getProducts();
    const categories = [...new Set(products.map(product => product.category))];
    return categories.filter(Boolean);
  }

  // Helper method to format price
  formatPrice(price: string): string {
    if (!price) return 'Contact for price';
    
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice);
  }
}

export default GoogleSheetsClient; 