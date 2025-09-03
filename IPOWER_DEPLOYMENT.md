# iPower Static Hosting Deployment Guide

## Overview
This guide covers deploying your Rusty Nuts Repair website to iPower's static hosting with Google Sheets integration.

## Prerequisites

### 1. iPower Hosting Account
- Shared hosting plan with cPanel access
- FTP/SFTP access to your hosting directory

### 2. Google Sheets Setup
- Google Sheets API key (see [Google Sheets Setup Guide](./GOOGLE_SHEETS_SETUP.md))
- Product spreadsheet created and shared

## Local Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your-api-key-here
NEXT_PUBLIC_PRODUCTS_SPREADSHEET_ID=your-spreadsheet-id-here
```

### 3. Build for Static Export
```bash
npm run build
npm run export
```

This creates a `out/` directory with all static files ready for upload.

## iPower Deployment

### Method 1: cPanel File Manager

1. **Access cPanel**
   - Log into your iPower cPanel
   - Navigate to "File Manager"

2. **Upload Files**
   - Navigate to your domain's public_html directory
   - Upload all contents from the `out/` folder
   - Ensure files are in the root of public_html

3. **Set Permissions**
   - Set directories to 755
   - Set files to 644

### Method 2: FTP/SFTP Upload

1. **Connect via FTP**
   - Use FileZilla or similar FTP client
   - Connect to your iPower FTP server
   - Navigate to public_html directory

2. **Upload Files**
   - Upload all contents from the `out/` folder
   - Maintain directory structure

## Environment Variables on iPower

Since iPower doesn't support server-side environment variables, we need to handle this differently:

### Option 1: Build-Time Variables (Recommended)
1. Set your environment variables locally
2. Build the project locally
3. Upload the built files

### Option 2: Client-Side Configuration
Create a `public/config.js` file:
```javascript
window.ENV = {
  NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY: 'your-api-key-here',
  NEXT_PUBLIC_PRODUCTS_SPREADSHEET_ID: 'your-spreadsheet-id-here'
};
```

Then update the Google Sheets client to read from this:
```javascript
this.apiKey = window.ENV?.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || '';
this.spreadsheetId = window.ENV?.NEXT_PUBLIC_PRODUCTS_SPREADSHEET_ID || '';
```

## File Structure on iPower

Your uploaded files should look like this:
```
public_html/
├── index.html
├── admin/
│   └── index.html
├── products/
│   ├── snowmobiles/
│   │   └── index.html
│   └── trailers/
│       └── index.html
├── _next/
│   └── static/
├── data/
│   └── products.json
└── products/
    ├── snowmobiles/
    ├── trailers/
    └── lawnmowers/
```

## Testing Your Deployment

### 1. Check Basic Functionality
- Visit your domain to ensure the site loads
- Test navigation between pages
- Verify images load correctly

### 2. Test Google Sheets Integration
- Visit `/admin` to check system status
- Verify products load from Google Sheets
- Test fallback to static JSON if needed

### 3. Test Product Pages
- Navigate to product categories
- Click on individual products
- Verify all product information displays

## Troubleshooting

### Common Issues

1. **404 Errors on Product Pages**
   - Ensure `.htaccess` file is uploaded
   - Check that trailing slashes are configured correctly

2. **Google Sheets API Not Working**
   - Verify API key is correct
   - Check spreadsheet sharing settings
   - Test with fallback JSON data

3. **Images Not Loading**
   - Verify image paths in Google Sheets
   - Check file permissions (644 for files, 755 for directories)
   - Ensure images are uploaded to correct locations

4. **JavaScript Errors**
   - Check browser console for errors
   - Verify all static files uploaded correctly
   - Test with different browsers

### Creating .htaccess for iPower

Create a `.htaccess` file in your public_html directory:
```apache
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## Security Considerations

1. **API Key Protection**
   - Restrict Google Sheets API key to your domain only
   - Use HTTPS for all API calls
   - Monitor API usage in Google Cloud Console

2. **File Permissions**
   - Set appropriate file permissions
   - Don't expose sensitive files
   - Use .htaccess to protect configuration files

3. **Regular Updates**
   - Keep your local build environment updated
   - Regularly update product data in Google Sheets
   - Monitor for any security updates

## Maintenance

### Updating Products
1. Edit your Google Sheets spreadsheet
2. Save changes
3. Refresh your website to see updates

### Updating the Website
1. Make code changes locally
2. Rebuild the project: `npm run build && npm run export`
3. Upload new files to iPower
4. Test functionality

### Backup Strategy
1. Keep local copy of all source code
2. Backup your Google Sheets spreadsheet
3. Regularly backup your static files
4. Document any custom configurations

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all files uploaded correctly
3. Test with the fallback JSON data
4. Contact iPower support for hosting-specific issues
5. Refer to the [Google Sheets Setup Guide](./GOOGLE_SHEETS_SETUP.md) for API issues 