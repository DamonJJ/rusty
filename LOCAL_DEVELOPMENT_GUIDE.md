# Local Development Setup Guide

This guide will help you run the Rusty's Products CMS locally for development and testing.

## Quick Start

### Step 1: Update Node.js

You need Node.js 18.18.0 or higher. Your current version (16.20.2) is too old.

**Option A: Using nvm (recommended)**
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install and use Node.js 20
nvm install 20
nvm use 20
```

**Option B: Download from nodejs.org**
- Go to https://nodejs.org
- Download the LTS version (20.x)
- Install it

### Step 2: Install Dependencies

```bash
cd /Users/damon.jacoby/code/rusty
npm install
```

### Step 3: Create Upload Directory

```bash
mkdir -p public/uploads
```

### Step 4: Start Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3060

## Local Features

### ✅ What Works Locally

- **Product Management**: Add, edit, delete products using JSON file storage
- **Image Upload**: Upload images to `public/uploads/` directory
- **Authentication**: Simple password protection (password: `rusty2024!`)
- **All CMS Features**: Full functionality without needing external services

### 📁 Local Storage

- **Products**: Stored in `public/data/products.json`
- **Images**: Stored in `public/uploads/`
- **No Database Required**: Everything works with local files

### 🔧 How It Works

The app automatically detects if you're running locally and falls back to:
- JSON file database instead of PostgreSQL
- Local file storage instead of Vercel Blob
- All features work the same way

## Testing the CMS

1. **Visit the Admin**: http://localhost:3060/admin
2. **Login**: Use password `rusty2024!`
3. **Test Features**:
   - Add a new product
   - Upload some images
   - Edit an existing product
   - Delete a product

## File Structure

```
public/
├── data/
│   └── products.json          # Product database
├── uploads/                   # Uploaded images
└── products/                  # Existing product images
    ├── snowmobiles/
    ├── trailers/
    └── lawnmowers/

src/
├── app/
│   ├── admin/                 # Admin CMS pages
│   └── api/                   # API routes with local fallbacks
├── components/
│   └── AdminAuth.tsx          # Authentication wrapper
└── lib/
    ├── auth.ts               # Authentication logic
    └── localDatabase.ts      # Local JSON database operations
```

## Common Issues & Solutions

### Issue: "Failed to fetch products"
**Solution**: Make sure you've updated Node.js to version 18+ and restarted the dev server.

### Issue: Image uploads not working
**Solution**: Make sure the `public/uploads` directory exists:
```bash
mkdir -p public/uploads
```

### Issue: Products not saving
**Solution**: Check that `public/data/products.json` exists and is writable.

### Issue: Authentication not working
**Solution**: Clear your browser's localStorage and try again.

## Deployment Options

### Option 1: Vercel (Recommended)
- Follow the guide in `VERCEL_CMS_SETUP.md`
- Use PostgreSQL database and Vercel Blob storage
- Free tier available

### Option 2: Static Hosting
- The app can work with just the JSON file approach
- Upload to any static host (Netlify, GitHub Pages, etc.)
- Limited to file-based storage

## Environment Variables (Optional)

Create a `.env.local` file for production database testing:

```bash
# For testing with Vercel Postgres
POSTGRES_URL="your-postgres-url"
BLOB_READ_WRITE_TOKEN="your-blob-token"
```

If these are not set, the app automatically uses local storage.

## Development Tips

1. **Hot Reload**: Changes to code will automatically reload the page
2. **API Testing**: Use browser dev tools to inspect API calls
3. **Data Reset**: Delete `public/data/products.json` to reset all products
4. **Image Cleanup**: Clear `public/uploads/` to remove uploaded images

## Next Steps

Once you've tested locally and everything works:

1. Push your code to GitHub
2. Deploy to Vercel using the production guide
3. Set up PostgreSQL and Blob storage for production
4. Your CMS will automatically switch to production services

The local development environment is perfect for testing and development without needing any external services!
