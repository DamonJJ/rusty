# Rusty Nuts Repair - Product Showcase

A Next.js product showcase website for Rusty Nuts Repair, featuring dynamic product management through Google Sheets integration.

## Features

- **Dynamic Product Management**: Products are managed through Google Sheets, allowing non-technical users to update inventory
- **Automatic Updates**: Product changes in the spreadsheet automatically reflect on the website
- **Fallback System**: Graceful fallback to static JSON if Google Sheets API is unavailable
- **Rich Product Information**: Detailed product pages with images, descriptions, pricing, and specifications
- **Category Organization**: Products organized by categories (snowmobiles, trailers, lawnmowers)
- **Responsive Design**: Mobile-friendly interface with modern styling
- **Admin Dashboard**: Built-in admin panel to monitor system status and product inventory

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google Sheets API access
- Google Cloud Console account

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Google Sheets Setup Guide](./GOOGLE_SHEETS_SETUP.md)):
```bash
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your-api-key-here
NEXT_PUBLIC_PRODUCTS_SPREADSHEET_ID=your-spreadsheet-id-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3060](http://localhost:3060) to view the website

### Admin Access

Visit `/admin` to access the product management dashboard and monitor system status.

## Product Management

### Adding Products

1. Add a new row to your Google Sheets spreadsheet
2. Fill in required fields (ID, Name, Category)
3. Add image paths (comma-separated)
4. Save the spreadsheet
5. Refresh the website to see changes

### Image Management

- Upload images to `public/products/[category]/[product-id]/`
- Reference images in the spreadsheet using full paths
- Multiple images can be separated by commas

## Deployment

This application is designed to work with static hosting providers:

```bash
npm run build
npm run export
```

The exported files can be deployed to any static hosting service.

## Documentation

- [Google Sheets Setup Guide](./GOOGLE_SHEETS_SETUP.md) - Complete setup instructions
- [Admin Dashboard](./src/app/admin/page.tsx) - Product management interface

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Source**: Google Sheets API
- **Fallback**: Static JSON

## Support

For setup assistance or questions about the Google Sheets integration, refer to the [setup guide](./GOOGLE_SHEETS_SETUP.md).
