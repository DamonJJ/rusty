#!/bin/bash

# Rusty Nuts Repair - iPower Deployment Script
# This script builds and prepares the site for static hosting on iPower

echo "🚀 Starting deployment process for iPower..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "   Make sure you have set up your environment variables:"
    echo "   - NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY"
    echo "   - NEXT_PUBLIC_PRODUCTS_SPREADSHEET_ID"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next out

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Export static files
echo "📤 Exporting static files..."
npm run export

# Check if export was successful
if [ ! -d "out" ]; then
    echo "❌ Export failed - 'out' directory not found"
    exit 1
fi

# Copy .htaccess to out directory
echo "📋 Copying .htaccess file..."
cp public/.htaccess out/

# Show deployment summary
echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📁 Files ready for upload:"
echo "   Source: ./out/"
echo "   Upload all contents to your iPower public_html directory"
echo ""
echo "📋 Upload checklist:"
echo "   ☐ All files from ./out/ uploaded to public_html"
echo "   ☐ .htaccess file is in public_html root"
echo "   ☐ File permissions set (644 for files, 755 for directories)"
echo "   ☐ Test website functionality"
echo "   ☐ Test Google Sheets integration at /admin"
echo ""
echo "🌐 After upload, test these URLs:"
echo "   - Your domain (homepage)"
echo "   - Your domain/admin (admin dashboard)"
echo "   - Your domain/products/snowmobiles (product categories)"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - IPOWER_DEPLOYMENT.md"
echo "   - GOOGLE_SHEETS_SETUP.md"
echo ""
echo "🎉 Ready for iPower deployment!" 