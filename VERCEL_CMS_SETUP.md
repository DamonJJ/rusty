# Vercel CMS Deployment Guide

This guide will help you deploy your Rusty's Products CMS to Vercel for free.

## Prerequisites

1. A Vercel account (free at vercel.com)
2. A GitHub account
3. Your project code pushed to a GitHub repository

## Step 1: Database Setup

### Option A: Vercel Postgres (Recommended - Free Tier Available)

1. Go to your Vercel dashboard
2. Click on "Storage" in the sidebar
3. Click "Create Database" and select "Postgres"
4. Choose a name for your database
5. Select the free "Hobby" plan
6. Click "Create"

### Option B: Neon Postgres (Alternative Free Option)

1. Go to neon.tech and create a free account
2. Create a new database
3. Copy the connection string

## Step 2: Environment Variables

In your Vercel project settings, add these environment variables:

**If using Vercel Postgres:**
- These will be automatically added when you create the database

**If using Neon or another provider:**
- `POSTGRES_URL` - Your full connection string
- `POSTGRES_PRISMA_URL` - Your connection string with `?pgbouncer=true&connect_timeout=15`
- `POSTGRES_URL_NON_POOLING` - Your direct connection string

**For file uploads (Vercel Blob):**
- `BLOB_READ_WRITE_TOKEN` - Create this in Vercel Storage > Blob

## Step 3: Initialize Database

1. Connect to your database using the Vercel dashboard or a tool like pgAdmin
2. Run the SQL commands from `database.sql` to create tables and sample data

## Step 4: Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to vercel.com and click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project
5. Click "Deploy"

### Method 2: Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts

## Step 5: Access Your CMS

1. Once deployed, visit `https://your-project.vercel.app/admin`
2. Use the password: `rusty2024!`
3. Start managing your products!

## Features

### ✅ What's Included

- **Product Management**: Add, edit, delete products
- **Image Upload**: Upload product images using Vercel Blob storage
- **Categories**: Organize products by category (snowmobiles, trailers, lawnmowers)
- **Authentication**: Simple password protection for admin area
- **Responsive Design**: Works on desktop and mobile
- **Search & Filter**: Built-in product search and filtering
- **Database**: PostgreSQL with proper indexing

### 🔒 Security Features

- Admin routes protected with authentication
- File upload validation (images only, size limits)
- SQL injection protection with parameterized queries
- XSS protection with React's built-in sanitization

### 📱 User Experience

- Clean, modern interface
- Loading states and error handling
- Drag & drop image uploads
- Responsive image galleries
- Form validation

## Customization

### Adding New Categories

1. Update the category options in:
   - `src/app/admin/products/new/page.tsx`
   - `src/app/admin/products/[id]/edit/page.tsx`

### Changing Admin Password

1. Update `ADMIN_PASSWORD` in `src/lib/auth.ts`
2. For production, use environment variables

### Styling

- The app uses Tailwind CSS
- Modify styles in the component files
- Global styles in `src/app/globals.css`

## Troubleshooting

### Database Connection Issues

1. Check environment variables are set correctly
2. Verify database is running and accessible
3. Check Vercel function logs

### Image Upload Issues

1. Verify `BLOB_READ_WRITE_TOKEN` is set
2. Check file size limits (5MB max)
3. Ensure images are valid formats

### Authentication Issues

1. Check password in `src/lib/auth.ts`
2. Clear browser localStorage if needed
3. Check for JavaScript errors in browser console

## Cost Breakdown (Free Tier)

- **Vercel Hosting**: Free for hobby projects
- **Vercel Postgres**: 60 hours of compute time per month
- **Vercel Blob**: 1GB storage included
- **Bandwidth**: 100GB per month

This should be sufficient for small to medium product catalogs.

## Going to Production

For production use, consider:

1. Use environment variables for the admin password
2. Implement proper user authentication (Auth0, NextAuth.js)
3. Add database backups
4. Set up monitoring and logging
5. Add rate limiting
6. Implement proper error boundaries
7. Add automated testing

## Support

If you encounter issues:

1. Check Vercel function logs
2. Verify all environment variables
3. Test database connection
4. Check browser console for errors

The CMS is now ready for production use on Vercel's free tier!
