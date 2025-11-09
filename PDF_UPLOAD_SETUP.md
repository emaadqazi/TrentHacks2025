# PDF Resume Upload Feature - Setup Instructions

## Overview

This feature allows users to upload PDF resumes which are automatically parsed into editable, draggable blocks in the Block Editor.

## What Was Implemented

### Backend (Node.js/Express/TypeScript)
- ✅ PDF parsing service (`backend/src/services/pdfParser.ts`)
- ✅ Upload endpoint (`/api/resume/upload`)
- ✅ Multer middleware for file uploads
- ✅ Intelligent text-to-blocks parsing with section detection

### Frontend (React/TypeScript)
- ✅ File upload UI with hidden input
- ✅ Upload button with loading states
- ✅ Error handling with toast notifications
- ✅ Automatic integration with existing block editor
- ✅ Full drag-and-drop support for uploaded blocks

## Installation Steps

### 1. Install Backend Dependencies

Navigate to the backend directory and install required packages:

```bash
cd backend
npm install multer @types/multer pdf-parse uuid @types/uuid
```

**Dependencies:**
- `multer` - File upload middleware for Express
- `@types/multer` - TypeScript types for multer
- `pdf-parse` - PDF text extraction library
- `uuid` - UUID generation for block IDs
- `@types/uuid` - TypeScript types for uuid

### 2. Restart Backend Server

```bash
cd backend
npm run dev
```

The server should start on `http://localhost:5000`

### 3. Frontend is Already Set Up

The frontend is ready to go! Just ensure your dev server is running:

```bash
cd frontend
npm run dev
```

## How to Use

### 1. Navigate to Block Editor

Go to `http://localhost:3000/editor`

### 2. Upload a PDF Resume

Click the **"Upload Resume"** button and select a PDF file.

### 3. Watch the Magic!

- PDF is parsed automatically
- Text is intelligently split into sections (Experience, Education, Skills, etc.)
- Bullet points are detected and cleaned
- All blocks appear in the editor, fully editable and draggable

## Features

### Smart Parsing

The parser automatically:
- **Detects section headings** (EXPERIENCE, EDUCATION, SKILLS, etc.)
- **Identifies bullet points** (•, -, *, numbered lists)
- **Cleans up formatting** (removes bullet characters, extra spaces)
- **Organizes content** into logical sections

### Supported Bullet Markers
- • ◦ ▪ ○ ● (unicode bullets)
- - – — (dashes)
- * (asterisks)
- 1. 2. 3. (numbered lists)

### Error Handling

- ✅ File type validation (PDF only)
- ✅ File size limit (10MB max)
- ✅ Empty PDF detection
- ✅ Parse failure recovery
- ✅ User-friendly error messages

### Loading States

- Spinner animation during upload
- "Parsing PDF..." text
- Disabled buttons during processing

### Success Feedback

Toast notification showing:
- Number of blocks imported
- Filename

Example: *"Imported 37 blocks from John_Doe_Resume.pdf"*

## API Endpoint

### POST `/api/resume/upload`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field containing PDF

**Response (Success):**
```json
{
  "success": true,
  "sections": [
    {
      "id": "uuid",
      "type": "experience",
      "label": "WORK EXPERIENCE",
      "blocks": [
        {
          "id": "uuid",
          "type": "bullet",
          "text": "Developed React applications..."
        }
      ],
      "order": 0
    }
  ],
  "metadata": {
    "totalSections": 4,
    "totalBlocks": 37,
    "pages": 2
  }
}
```

**Response (Error):**
```json
{
  "error": "Only PDF files are supported"
}
```

## Testing

### Test with Sample PDF

1. Create a simple PDF resume with:
   - Section headings (EXPERIENCE, EDUCATION, SKILLS)
   - Bullet points with different markers
   - Multiple sections

2. Upload through the UI

3. Verify:
   - All sections appear as separate cards
   - Bullets are properly cleaned (no • symbols in text)
   - Blocks are draggable
   - Blocks are editable
   - Section ordering makes sense

### Edge Cases to Test

- [ ] Empty PDF → Should show error
- [ ] PDF with images only → Should show error
- [ ] Very large PDF (>10MB) → Should show size error
- [ ] Non-PDF file → Should show type error
- [ ] PDF with unusual formatting → Should still extract text
- [ ] Re-uploading another PDF → Should replace existing blocks

## Architecture

```
Frontend (ResumeCanvas.tsx)
    ↓ [User clicks Upload Resume]
    ↓ [Selects PDF file]
    ↓ [File validation]
    ↓
    POST /api/resume/upload (FormData)
    ↓
Backend (routes/index.ts)
    ↓ [Multer middleware processes file]
    ↓
Backend (controllers/resumeController.ts)
    ↓ [pdf-parse extracts text]
    ↓
Backend (services/pdfParser.ts)
    ↓ [Parse text into sections & blocks]
    ↓
    JSON response with structured data
    ↓
Frontend (ResumeCanvas.tsx)
    ↓ [Create Resume object]
    ↓ [Update state]
    ↓
    Blocks appear in editor (fully functional!)
```

## Troubleshooting

### "Module not found: multer"
```bash
cd backend
npm install multer @types/multer
```

### "Module not found: pdf-parse"
```bash
cd backend
npm install pdf-parse
```

### Upload button doesn't work
1. Check browser console for errors
2. Verify backend is running on port 5000
3. Check CORS settings in `backend/src/index.ts`

### PDF parses but no blocks appear
1. Check browser console for errors
2. Verify the API response contains `sections` array
3. Check that sections have `blocks` arrays with content

### "Failed to parse PDF"
- PDF might be encrypted or password-protected
- PDF might contain only images (no text layer)
- Try a different PDF or convert to a standard format

## Future Enhancements

Potential improvements:
- [ ] Support for .docx files
- [ ] OCR for image-based PDFs
- [ ] AI-powered section classification
- [ ] Confidence scores for bullet quality
- [ ] Duplicate detection
- [ ] Smart merging with existing resume

## Files Modified/Created

### Backend
- ✅ `backend/src/services/pdfParser.ts` (NEW)
- ✅ `backend/src/controllers/resumeController.ts` (MODIFIED)
- ✅ `backend/src/routes/index.ts` (MODIFIED)

### Frontend  
- ✅ `frontend/src/components/block-editor/ResumeCanvas.tsx` (MODIFIED)

### Documentation
- ✅ `PDF_UPLOAD_SETUP.md` (NEW)

## Success! 🎉

You now have a fully functional PDF resume upload system that:
- Accepts PDF uploads
- Intelligently parses content
- Creates draggable, editable blocks
- Provides excellent UX with loading states and error handling
- Works seamlessly with your existing block editor

Try uploading a PDF resume and watch it transform into editable blocks!

