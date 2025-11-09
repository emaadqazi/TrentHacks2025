# How to Run the Application

## Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Install Frontend Dependencies (if not already done)

```bash
cd frontend
npm install
```

## Step 3: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

The backend will start on **http://localhost:5000**

You should see:
```
🚀 Server is running on http://localhost:5000
```

## Step 4: Start the Frontend Server

Open a **new terminal** (keep the backend running) and run:

```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:3000**

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 5: Open in Browser

1. Open your browser and go to: **http://localhost:3000**
2. Navigate to the Block Editor page (usually `/editor`)
3. You should see:
   - Left panel: AI Suggestions (empty until you analyze a job description)
   - Right panel: Live Resume Preview

## Testing the Features

### 1. Upload a PDF Resume
- Click "Upload Resume" in the editor
- Select a PDF file
- The resume will be parsed and displayed in sections

### 2. Analyze Job Description
- Click the "Job Description" button (bottom right if hidden)
- Enter a job description
- Click "Analyze" to generate AI suggestions

### 3. Drag and Drop
- Drag items from the AI Suggestions panel (left) to the Live Preview (right)
- Or click items to add them directly

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check if all dependencies are installed: `cd backend && npm install`

### Frontend won't start
- Make sure port 3000 is not in use
- Check if all dependencies are installed: `cd frontend && npm install`

### API calls failing
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify the proxy configuration in `vite.config.ts`

## Quick Start (Both Servers)

You can run both servers in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend && npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm run dev
```

Then open: **http://localhost:3000**

