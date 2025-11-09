from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()

class ExperienceEntry(BaseModel):
    company: str
    role: str
    location: str
    startDate: str
    endDate: str
    bullets: List[str]

class AnalyzeRequest(BaseModel):
    experienceEntry: ExperienceEntry
    jobDescription: Optional[str] = None

class AIScore(BaseModel):
    overall: int
    keywordMatch: int
    bulletStrengths: List[int]
    suggestions: List[str]
    missingKeywords: List[str]

class AnalyzeResponse(BaseModel):
    success: bool
    aiScore: AIScore

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_experience(request: AnalyzeRequest):
    """
    Analyze an experience entry and provide AI-powered insights.
    
    TODO: Integrate with OpenAI/Anthropic API for real analysis
    For now, this returns mock data
    """
    try:
        # Mock AI analysis - replace with actual AI API call
        overall_score = random.randint(65, 95)
        keyword_match = random.randint(60, 90)
        
        bullet_strengths = [
            random.randint(55, 95) 
            for _ in request.experienceEntry.bullets
        ]
        
        suggestions = [
            "Use stronger action verbs like 'implemented', 'architected', 'spearheaded', or 'led'",
            "Quantify your achievements with specific numbers, percentages, or metrics",
            "Incorporate technical keywords and skills from the job description",
            "Start each bullet with an action verb and focus on impact",
            "Highlight measurable outcomes and business value delivered"
        ]
        
        # Random selection of 3-5 suggestions
        selected_suggestions = random.sample(suggestions, k=random.randint(3, 5))
        
        missing_keywords = [
            "Python", "JavaScript", "React", "TypeScript", "AWS", 
            "Docker", "Kubernetes", "CI/CD", "Agile", "Microservices"
        ]
        
        # Random selection of missing keywords
        selected_keywords = random.sample(missing_keywords, k=random.randint(3, 6))
        
        ai_score = AIScore(
            overall=overall_score,
            keywordMatch=keyword_match,
            bulletStrengths=bullet_strengths,
            suggestions=selected_suggestions,
            missingKeywords=selected_keywords
        )
        
        return AnalyzeResponse(
            success=True,
            aiScore=ai_score
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# TODO: Add job description analysis endpoint
@router.post("/analyze-job-description")
async def analyze_job_description(job_description: str):
    """
    Extract keywords and requirements from a job description.
    
    TODO: Implement with NLP/AI
    """
    return {
        "keywords": [],
        "requiredSkills": [],
        "preferredSkills": []
    }

