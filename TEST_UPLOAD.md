# Upload Testing Guide

## Check Backend is Running

```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"ok"}`

## Test Upload with curl

```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "file=@/path/to/your/resume.pdf" \
  -v
```

## Frontend Debugging Steps

### 1. Open Browser Console (F12)
When you try to upload, you should see:
- `📤 Uploading: filename.pdf XXX bytes`
- `📤 URL: /api/resume/upload`
- `📥 Response status: XXX`

### 2. Check Network Tab
- Find the `/api/resume/upload` request
- Check the Status (should be 200, not 403)
- Check Response tab for error message
- Check Request Headers - Content-Type should include `multipart/form-data`

### 3. Check Frontend Terminal (where `npm run dev` runs)
You should see:
- `🔄 Proxying: POST /api/resume/upload → http://localhost:5000/api/resume/upload`
- `📥 Proxy response: 200 for /api/resume/upload`

### 4. Check Backend Terminal
You should see:
- `POST /api/resume/upload`
- `📤 Upload request received`
- `✅ File: filename.pdf XXX bytes`
- `✅ Extracted text, length: XXX`
- `✅ Parsed into X sections, X blocks`

## Common Issues

### "Failed to fetch" or "Cannot connect to server"
- Backend not running → Run `cd backend && npm run dev`
- Wrong port → Check backend is on port 5000

### 403 Forbidden
- CORS issue → Check backend CORS settings
- Proxy not working → Restart frontend

### 400 Bad Request
- No file uploaded → Check FormData key is 'file'
- Invalid file → Check file is a PDF

## Quick Fix

If nothing works, restart everything:

```bash
# Stop all (Ctrl+C in each terminal)

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Then try upload again
```

