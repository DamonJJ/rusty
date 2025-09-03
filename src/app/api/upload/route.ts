import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Try to import Vercel Blob, but fall back to local storage if not available
let put: any = null
try {
  const vercelBlob = require('@vercel/blob')
  put = vercelBlob.put
} catch (error) {
  console.log('Vercel Blob not available, using local storage')
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    
    // Try Vercel Blob first, fall back to local storage
    if (put && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(filename, file, {
          access: 'public',
        })

        return NextResponse.json({
          url: blob.url,
          filename: filename
        })
      } catch (error) {
        console.error('Blob storage error, falling back to local:', error)
      }
    }
    
    // Use local storage
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    // Save file locally
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, filename)
    fs.writeFileSync(filePath, buffer)
    
    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename: filename
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 