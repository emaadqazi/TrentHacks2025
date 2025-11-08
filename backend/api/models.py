from pydantic import BaseModel
from typing import List, Optional


class BulletPoint(BaseModel):
    id: str
    text: str


class Block(BaseModel):
    """Base block model for all resume components"""
    id: str
    type: str  # 'bullet', 'header', 'meta', 'skill-item'
    text: str
    bullets: List[BulletPoint] = []
    score: Optional[int] = None
    strength: Optional[str] = None
    tags: Optional[List[str]] = None


class ExperienceBlock(Block):
    """Work experience block with job details"""
    company: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    dateRange: Optional[str] = None


class EducationBlock(Block):
    """Education block with institution details"""
    institution: Optional[str] = None
    degree: Optional[str] = None
    field: Optional[str] = None
    location: Optional[str] = None
    dateRange: Optional[str] = None


class ProjectBlock(Block):
    """Project block with project details"""
    name: Optional[str] = None
    dateRange: Optional[str] = None


class SkillBlock(Block):
    """Individual skill item"""
    pass


class Section(BaseModel):
    """Resume section containing blocks"""
    id: str
    type: str  # 'education', 'experience', 'projects', 'skills', 'summary', 'certifications'
    label: str
    blocks: List[Block]
    order: int


class Resume(BaseModel):
    """Complete resume structure"""
    resumeId: str
    title: str
    sections: List[Section]


class ParsedResumeResponse(BaseModel):
    """Response from parse-resume endpoint"""
    sections: List[Section]
    resumeId: str
    title: str
    error: Optional[str] = None
