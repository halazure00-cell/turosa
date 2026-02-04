# Turosa OCR & Digitization Feature

## Overview

This document describes the OCR (Optical Character Recognition) and digitization features implemented for Turosa using Google Cloud Vision API.

## Features Implemented

### 1. OCR API Endpoint (`/api/ocr`)

A backend API route that accepts image files and performs OCR using Google Cloud Vision API.

**Endpoint:** `POST /api/ocr`

**Request Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",  // Optional: URL of the image
  "imageBase64": "base64_encoded_image_data"    // Optional: Base64 encoded image
}
```

**Response (Success):**
```json
{
  "text": "Extracted text from the image",
  "confidence": 0.95,
  "language": "ar",
  "detectionCount": 150
}
```

**Response (Error - No Credentials):**
```json
{
  "error": "Google Cloud Credentials belum dikonfigurasi. Silakan cek file .env.local",
  "details": "GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, dan GOOGLE_PROJECT_ID diperlukan"
}
```

**Key Features:**
- Uses `documentTextDetection` for better accuracy on dense text
- Configured with `languageHints: ['ar']` for Arabic text (Kitab texts)
- Graceful error handling for missing credentials
- Supports both image URL and base64 encoded images

### 2. Digitization Workspace (`/digitize/[bookId]`)

A dedicated page for digitizing book pages into editable chapters.

**URL:** `/digitize/[bookId]`

**Features:**
- **Split-view UI:** Image preview on the left, text editor on the right
- **Image Upload:** Drag and drop or click to upload page images
- **OCR Scanning:** "Scan Halaman" button triggers Google Cloud Vision OCR
- **Human-in-the-Loop Editing:** Editable textarea for correcting OCR results
- **Chapter Management:** Input for chapter title and save to database
- **Right-to-Left Text:** Textarea configured for Arabic text direction

**Workflow:**
1. Upload an image of a Kitab page
2. Click "Scan Halaman" to perform OCR
3. Review and edit the extracted text
4. Enter a chapter title
5. Click "Simpan Bab" to save to the database

### 3. Updated Reader Page (`/reader/[bookId]`)

Enhanced book reader page with digitization capabilities.

**New Features:**
- **Digitization Button:** "Digitalisasi Kitab Ini" button linking to the workspace
- **Chapters List:** Displays all digitized chapters for the book
- **Chapter Preview:** Shows chapter title, order, and content preview

## Setup Instructions

### 1. Install Dependencies

The `@google-cloud/vision` package has already been installed:

```bash
npm install
```

### 2. Configure Google Cloud Credentials

Create or update your `.env.local` file with Google Cloud service account credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Cloud Vision API (for OCR)
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_service_account_private_key
GOOGLE_PROJECT_ID=your_project_id
```

**How to get Google Cloud credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Vision API
4. Create a service account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and description
   - Grant it the "Cloud Vision API User" role
   - Create and download a JSON key
5. From the JSON key file, extract:
   - `client_email` → `GOOGLE_CLIENT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (keep the \n characters)
   - `project_id` → `GOOGLE_PROJECT_ID`

**Important:** The `GOOGLE_PRIVATE_KEY` should include the full private key with `\n` escape sequences. The API route handles converting them to actual newlines.

### 3. Database Schema

Ensure the `chapters` table exists in your Supabase database:

```sql
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    content TEXT
);
```

## Usage Guide

### For Users

1. **Navigate to a Book:** Go to the library and select a book
2. **Click Digitization Button:** On the book reader page, click "Digitalisasi Kitab Ini"
3. **Upload Page Image:** Upload an image of the Kitab page you want to digitize
4. **Scan the Page:** Click "Scan Halaman" to extract text using OCR
5. **Review & Edit:** The extracted text appears in the editor. Edit as needed.
6. **Save Chapter:** Enter a chapter title and click "Simpan Bab"
7. **View Chapters:** Return to the reader page to see all digitized chapters

### For Developers

**Testing the OCR API:**

```bash
curl -X POST http://localhost:3000/api/ocr \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "YOUR_BASE64_ENCODED_IMAGE"
  }'
```

**API Error Handling:**

The API gracefully handles missing credentials and returns clear error messages:

```json
{
  "error": "Google Cloud Credentials belum dikonfigurasi. Silakan cek file .env.local",
  "details": "GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, dan GOOGLE_PROJECT_ID diperlukan"
}
```

## Architecture

### Component Structure

```
src/app/
├── api/
│   └── ocr/
│       └── route.ts          # OCR API endpoint
├── digitize/
│   └── [bookId]/
│       └── page.tsx           # Digitization workspace
└── reader/
    └── [bookId]/
        └── page.tsx           # Updated reader with chapters
```

### Data Flow

1. **Image Upload** → User selects image file
2. **Base64 Conversion** → File converted to base64 in browser
3. **API Request** → POST to `/api/ocr` with base64 data
4. **Google Cloud Vision** → API calls Vision API with `documentTextDetection`
5. **Text Extraction** → Receives Arabic text from image
6. **Human Review** → User edits text in textarea
7. **Save to Database** → Text saved to `chapters` table via Supabase

## Security Considerations

- **Private Keys:** Google Cloud private keys are stored as environment variables and never exposed to the client
- **API Routes:** OCR processing happens server-side only
- **Authentication:** Save chapter functionality requires authenticated user
- **Input Validation:** API validates required fields before processing

## Troubleshooting

### "Google Cloud Credentials belum dikonfigurasi"

**Solution:** Ensure all three Google Cloud environment variables are set in `.env.local`:
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_PROJECT_ID`

### OCR Returns Empty Text

**Possible causes:**
- Image quality is too low
- Text is too small or blurry
- Language detection failed

**Solutions:**
- Use higher quality images
- Ensure text is clearly visible
- Verify the image contains actual text

### Private Key Format Error

**Problem:** The private key must maintain its newline characters.

**Solution:** When copying the private key from the JSON file, keep it as-is including the `\n` escape sequences. The API route converts them automatically.

## Future Enhancements

- [ ] Batch processing of multiple pages
- [ ] Direct PDF page extraction
- [ ] Advanced OCR settings (contrast, rotation)
- [ ] Chapter reordering via drag & drop
- [ ] Export chapters to various formats
- [ ] OCR quality metrics and confidence scores
- [ ] Multi-language support beyond Arabic

## License

MIT License - See LICENSE file for details
