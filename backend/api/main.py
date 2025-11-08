from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import tempfile
import os
import sys
from typing import List, Dict, Any
from pydantic import BaseModel

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from parse import parse_resume

app = FastAPI(title="ResuBlocks API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BulletPoint(BaseModel):
    id: str
    text: str


class JobBlock(BaseModel):
    id: str
    company: str
    title: str
    location: str
    dateRange: str
    bullets: List[BulletPoint]


class ResumeData(BaseModel):
    blocks: List[JobBlock]


@app.get("/")
async def root():
    return {"message": "ResuBlocks API is running"}

@app.get("/api/health")
async def health():
    """Health check endpoint for frontend status checks"""
    return {"status": "ok", "message": "ResuBlocks API is running"}


@app.post("/api/parse-resume")
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """
    Parse an uploaded PDF resume and return structured job blocks.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Parse the PDF
        result = parse_resume(temp_path)
        
        # Clean up temporary file
        os.unlink(temp_path)
        
        if 'error' in result:
            raise HTTPException(status_code=500, detail=result['error'])
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/export-resume")
async def export_resume_endpoint(data: ResumeData):
    """
    Generate a PDF from edited resume blocks.
    """
    try:
        from export import generate_resume_pdf
        
        # Generate PDF
        pdf_path = generate_resume_pdf(data.dict())
        
        # Return PDF file
        return FileResponse(
            pdf_path,
            media_type='application/pdf',
            filename='resume_export.pdf'
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze-component")
async def analyze_component_endpoint(component: Dict[str, Any]):
    """
    Analyze a resume component using AI (Claude).
    """
    try:
        from analyze import analyze_component_ai
        
        result = analyze_component_ai(component)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)

