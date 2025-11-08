# 🚀 How to Start the Backend Server

## Quick Start (Easiest Way)

### On Mac/Linux:
```bash
cd backend
./start.sh
```

### On Windows:
```bash
cd backend
start.bat
```

---

## Manual Setup (Step by Step)

### 1. Open Terminal and Navigate to Backend
```bash
cd "/Users/emaadqazi/Desktop/Coding Projects/TrentHacks2025/backend"
```

### 2. Create Python Virtual Environment
```bash
python3 -m venv venv
```

### 3. Activate Virtual Environment

**Mac/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

This installs:
- FastAPI (web framework)
- uvicorn (ASGI server)
- pdfplumber (PDF parsing)
- reportlab (PDF generation)
- python-multipart (file uploads)

### 5. Start the Server
```bash
cd api
python main.py
```

---

## ✅ Verify It's Working

You should see output like:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:5000 (Press CTRL+C to quit)
```

### Test the API:

1. **Health Check:**
   ```bash
   curl http://localhost:5000/
   ```
   Should return: `{"message":"ResuBlocks API is running"}`

2. **View API Docs:**
   Open in browser: http://localhost:5000/docs

3. **Test PDF Parsing:**
   ```bash
   curl -X POST http://localhost:5000/api/parse-resume \
     -F "file=@/path/to/your/resume.pdf"
   ```

---

## 🔧 Troubleshooting

### Problem: `python3: command not found`
**Solution:** Use `python` instead of `python3`, or install Python 3.8+

### Problem: `ModuleNotFoundError: No module named 'fastapi'`
**Solution:** 
1. Make sure virtual environment is activated (see `(venv)` in prompt)
2. Run: `pip install -r requirements.txt`

### Problem: `Port 5000 already in use`
**Solution:** Kill the process using port 5000:

**Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Problem: `ImportError: cannot import name 'parse_resume'`
**Solution:** Make sure you're in the `api` directory:
```bash
cd api
python main.py
```

### Problem: `Permission denied` when running start.sh
**Solution:** Make the script executable:
```bash
chmod +x start.sh
```

---

## 📝 What Happens Next

Once the backend is running:

1. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open Browser:**
   Go to: http://localhost:3000/resume-test

3. **Upload PDF:**
   - Drag and drop your PDF resume
   - Backend will parse it automatically
   - Blocks will appear below the preview

---

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `./start.sh` | Start server (Mac/Linux) |
| `start.bat` | Start server (Windows) |
| `python main.py` | Start server manually |
| `Ctrl+C` | Stop server |
| `http://localhost:5000/docs` | API documentation |

---

## 💡 Pro Tip

Keep the backend running in one terminal window, and run the frontend in another. Both need to be running simultaneously for the app to work!

