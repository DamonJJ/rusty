# Vercel Deployment Guide with Admin Panel

## Overview
This guide covers deploying your Rusty Nuts Repair website to Vercel with a full admin panel for product management.

## Prerequisites

### 1. Vercel Account
- Sign up at [vercel.com](https://vercel.com)
- Connect your GitHub account

### 2. GitHub Repository
- Push your code to GitHub
- Ensure all files are committed

## Deployment Steps

### 1. Connect to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Repository**
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### 2. Set Environment Variables

In your Vercel project settings, add these environment variables:

```bash
# Database (Vercel Postgres)
POSTGRES_URL=your-postgres-url
POSTGRES_HOST=your-postgres-host
POSTGRES_DATABASE=your-database-name
POSTGRES_USERNAME=your-username
POSTGRES_PASSWORD=your-password

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-blob-token
```

### 3. Add Vercel Postgres Database

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"

2. **Configure Database**
   - Choose a region close to your users
   - Select "Hobby" plan (free tier)
   - Click "Create"

3. **Get Connection Details**
   - Copy the connection details
   - Add them to your environment variables

### 4. Add Vercel Blob Storage

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Storage" tab
   - Click "Create Store"
   - Select "Blob"

2. **Configure Blob Storage**
   - Choose a region
   - Select "Hobby" plan (free tier)
   - Click "Create"

3. **Get Token**
   - Copy the read/write token
   - Add to environment variables

### 5. Set Up Database Schema

1. **Access Vercel Postgres**
   - In your project dashboard
   - Click "Storage" → "Postgres"
   - Click "Query" tab

2. **Run Schema Script**
   - Copy the contents of `database.sql`
   - Paste and run in the query editor

### 6. Deploy

1. **Trigger Deployment**
   - Push changes to GitHub
   - Vercel will auto-deploy

2. **Monitor Deployment**
   - Watch the build logs
   - Check for any errors

## Post-Deployment Setup

### 1. Test Admin Panel

1. **Visit Admin Panel**
   - Go to `yourdomain.com/admin`
   - Should show the product management interface

2. **Test Features**
   - Add a new product
   - Upload images
   - Edit existing products
   - Delete products

### 2. Update Product Pages

The product pages now use the database instead of Google Sheets:

```typescript
// Update src/app/products/[category]/page.tsx
// Update src/app/products/[category]/[product]/page.tsx
// To use database instead of Google Sheets
```

### 3. Set Up Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to project settings
   - Click "Domains"
   - Add your custom domain

2. **Configure DNS**
   - Follow Vercel's DNS instructions
   - Point your domain to Vercel

## Admin Panel Features

### What the Owner Can Do:

1. **View All Products**
   - See all products in a table
   - Filter by category
   - Search products

2. **Add New Products**
   - Fill out product form
   - Upload multiple images
   - Set pricing and details

3. **Edit Products**
   - Update product information
   - Add/remove images
   - Change pricing

4. **Delete Products**
   - Remove products from inventory
   - Confirmation prompts

### Admin Panel URLs:

- **Main Admin**: `/admin`
- **Add Product**: `/admin/products/new`
- **Edit Product**: `/admin/products/[id]/edit`

## Environment Variables Reference

| Variable | Description | Source |
|----------|-------------|---------|
| `POSTGRES_URL` | Database connection string | Vercel Postgres |
| `POSTGRES_HOST` | Database host | Vercel Postgres |
| `POSTGRES_DATABASE` | Database name | Vercel Postgres |
| `POSTGRES_USERNAME` | Database username | Vercel Postgres |
| `POSTGRES_PASSWORD` | Database password | Vercel Postgres |
| `BLOB_READ_WRITE_TOKEN` | Image upload token | Vercel Blob |

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check environment variables
   - Verify database is created
   - Check schema is applied

2. **Image Upload Fails**
   - Verify Blob storage is set up
   - Check BLOB_READ_WRITE_TOKEN
   - Check file size limits (5MB)

3. **Build Errors**
   - Check build logs in Vercel
   - Verify all dependencies installed
   - Check TypeScript errors

4. **Admin Panel Not Loading**
   - Check API routes are working
   - Verify database connection
   - Check browser console for errors

### Debugging:

1. **Check Vercel Logs**
   - Go to project dashboard
   - Click "Functions" tab
   - View function logs

2. **Test API Routes**
   - Visit `/api/products` directly
   - Check response in browser

3. **Database Queries**
   - Use Vercel Postgres query editor
   - Test SQL commands directly

## Migration from iPower

### Steps to Migrate:

1. **Export Current Data**
   - Export products from Google Sheets
   - Download images from iPower

2. **Import to Vercel**
   - Run migration script
   - Upload images to Vercel Blob

3. **Update DNS**
   - Point domain to Vercel
   - Wait for propagation

4. **Test Everything**
   - Verify all products load
   - Test admin panel
   - Check image uploads

## Cost Comparison

| Feature | iPower | Vercel |
|---------|--------|--------|
| **Hosting** | ~$5-10/month | Free tier |
| **Database** | Not available | Free Postgres |
| **File Storage** | Limited | Free Blob storage |
| **Admin Panel** | Not possible | Full CRUD |
| **Image Uploads** | Not possible | Drag & drop |
| **Deployments** | Manual FTP | Automatic |
| **Performance** | Basic | Global CDN |

## Support

### Vercel Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/nodejs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

### Getting Help:
1. Check Vercel deployment logs
2. Review function logs
3. Test API routes individually
4. Contact Vercel support if needed 