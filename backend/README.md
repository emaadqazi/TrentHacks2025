# ResuBlocks Backend API

Python FastAPI backend for parsing and exporting resumes.

## Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the server:**
```bash
cd api
python main.py
```

Server will run on `http://localhost:5001`

## API Endpoints

### POST /api/parse-resume
Upload a PDF resume and get structured job blocks.

**Request:** multipart/form-data with PDF file
**Response:**
```json
{
  "blocks": [
    {
      "id": "uuid",
      "company": "Samsung",
      "title": "Software Engineer",
      "location": "Toronto, ON",
      "dateRange": "May 2024 - Aug 2024",
      "bullets": [
        {
          "id": "uuid",
          "text": "Built tracking system..."
        }
      ]
    }
  ]
}
```

### POST /api/export-resume
Export edited blocks to PDF.

**Request:**
```json
{
  "blocks": [...]
}
```

**Response:** PDF file download

## Features

- PDF text extraction with pdfplumber
- Smart pattern matching for:
  - Company names (uppercase, bold text)
  - Job titles (italic, after company)
  - Locations (City, State format)
  - Date ranges (various formats)
  - Bullet points (markers: •, -, *, etc.)
- Professional PDF export with reportlab
- Error handling and fallbacks

## Testing

```bash
# Test parsing
curl -X POST http://localhost:5001/api/parse-resume \
  -F "file=@resume.pdf"

# Test export
curl -X POST http://localhost:5001/api/export-resume \
  -H "Content-Type: application/json" \
  -d '{"blocks": [...]}' \
  --output resume.pdf
```
