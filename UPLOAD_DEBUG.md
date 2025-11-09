# Upload Debugging Guide

## Fixes Applied

1. **Fixed API call** - Changed to use axios directly instead of api instance to avoid Content-Type header conflicts
2. **Added error handling** - Better error messages and logging
3. **Added multer error handling** - Catches file upload errors properly

## How to Debug

### 1. Check Browser Console
Open browser DevTools (F12) → Console tab
- Look for any error messages
- Check the network tab to see the request/response

### 2. Check Backend Logs
Look at the terminal where backend is running. You should see:
- `📤 Upload request: POST /api/resume/upload`
- `Content-Type: multipart/form-data; boundary=...`
- `📥 Upload request received`
- `✅ File received: { originalname, mimetype, size }`

### 3. Common Issues

**Issue: "Network error"**
- Backend not running → Start with `cd backend && npm run dev`
- Wrong port → Check backend is on port 5000
- CORS error → Check backend has `app.use(cors())`

**Issue: "No file uploaded"**
- Check Content-Type header in network tab
- Should be `multipart/form-data; boundary=...`
- If it's `application/json`, the fix didn't work

**Issue: "File too large"**
- PDF must be under 10MB
- Check file size before uploading

**Issue: "Invalid file type"**
- Must be a PDF file
- Check file extension is `.pdf`

## Test the Endpoint

You can test the backend directly:

```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "file=@/path/to/your/resume.pdf"
```

## Next Steps

1. Try uploading again
2. Check browser console for errors
3. Check backend terminal for logs
4. Share the error message you see

