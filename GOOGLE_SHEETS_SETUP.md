# Google Sheets Product Management Setup

## Overview
This setup allows the site owner to manage products through a Google Sheets spreadsheet, enabling easy updates without touching code.

## Setup Instructions

### 1. Create Google Sheets API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Go to "Credentials" and create an API key
5. Restrict the API key to Google Sheets API only for security

### 2. Create the Product Spreadsheet
1. Create a new Google Sheets document
2. Name the first sheet "Products"
3. Set up the following columns in order (A through M):

| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | ID | Unique product identifier | snowmobile-1 |
| B | Name | Product display name | Arctic Cat Snowmobile |
| C | Category | Product category | snowmobiles |
| D | Description | Product description | Excellent condition... |
| E | Price | Product price (numbers only) | 8500 |
| F | Condition | Product condition | Excellent |
| G | Year | Manufacturing year | 2020 |
| H | Make | Product make | Arctic Cat |
| I | Model | Product model | ZR 6000 |
| J | Images | Comma-separated image paths | /products/snowmobiles/snowmobile-1/snowmobile-1.JPG,/products/snowmobiles/snowmobile-1/snowmobile-2.JPG |
| K | Contact Phone | Contact phone number | (715) 430-2201 |
| L | Contact Email | Contact email address | vern@rustynuts.repair |
| M | Last Updated | Date last updated | 2024-01-15 |

### 3. Share the Spreadsheet
1. Click "Share" in the top right
2. Set to "Anyone with the link can view"
3. Copy the spreadsheet ID from the URL (the long string between /d/ and /edit)

### 4. Environment Variables
Create a `.env.local` file in your project root with:
```
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your-api-key-here
NEXT_PUBLIC_PRODUCTS_SPREADSHEET_ID=your-spreadsheet-id-here
```

### 5. Sample Data
Add this sample data to your spreadsheet (starting from row 2):

```
snowmobile-1 | Arctic Cat Snowmobile | snowmobiles | Excellent condition Arctic Cat snowmobile, perfect for winter adventures. | 8500 | Excellent | 2020 | Arctic Cat | ZR 6000 | /products/snowmobiles/snowmobile-1/snowmobile-1.JPG,/products/snowmobiles/snowmobile-1/snowmobile-2.JPG | (715) 430-2201 | vern@rustynuts.repair | 2024-01-15
```

## How It Works

### Data Flow
1. Website loads and calls Google Sheets API
2. API returns spreadsheet data
3. Data is converted to Product objects
4. Website displays products dynamically
5. If API fails, falls back to static JSON file

### Adding New Products
1. Add a new row to the Google Sheets spreadsheet
2. Fill in all required fields (ID, Name, Category)
3. Add image paths to the Images column (comma-separated)
4. Save the spreadsheet
5. Refresh the website to see changes

### Image Management
- Images should be uploaded to the `public/products/` directory
- Use the same folder structure as before
- Reference images by their full path starting with `/products/`
- Multiple images can be separated by commas

## Features

### Automatic Updates
- Products update automatically when the spreadsheet is modified
- No code changes required for content updates
- Real-time data synchronization

### Fallback System
- If Google Sheets API is unavailable, falls back to static JSON
- Ensures website remains functional during API issues
- Graceful error handling

### Rich Product Information
- Product descriptions and specifications
- Pricing information with currency formatting
- Contact information per product
- Multiple image support

### Category Management
- Products automatically organized by category
- Dynamic category pages
- Easy filtering and navigation

## Security Notes
- API key is restricted to Google Sheets API only
- Spreadsheet is set to read-only for public access
- No sensitive data stored in the spreadsheet
- Fallback system ensures data availability

## Troubleshooting

### Common Issues
1. **API Key Error**: Ensure API key is correct and Google Sheets API is enabled
2. **Spreadsheet ID Error**: Check that the spreadsheet ID is correct and sharing is enabled
3. **No Data**: Verify spreadsheet has data starting from row 2 (row 1 should be headers)
4. **Images Not Loading**: Check that image paths are correct and files exist

### Testing
1. Test with the sample data first
2. Verify API calls work in browser developer tools
3. Check fallback JSON loads correctly
4. Test with different categories and products

## Migration from File System
The system is designed to work alongside the existing file-based system:
1. Keep existing image folders in `public/products/`
2. Reference existing images in the spreadsheet
3. Gradually migrate products to spreadsheet management
4. Remove file-based product pages once migration is complete 