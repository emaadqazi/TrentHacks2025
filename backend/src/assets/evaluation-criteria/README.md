# Evaluation Criteria Directory

This directory contains the comprehensive FAANG/industry evaluation criteria used for resume critique.

## Purpose

These files form the foundation of the AI-powered resume evaluation system, providing:
- Detailed evaluation frameworks
- Scoring rubrics and weights
- Industry-standard best practices
- Structured criteria for consistent feedback

## Files

### `ai_resume_evaluator_prompt.md`
**Main AI System Prompt**
- Used as the system message for OpenAI API calls
- Contains comprehensive evaluation instructions
- Includes scoring guidelines, feedback format, and examples
- This is the primary file that guides AI evaluation

### `resume_criteria_structured.json`
**Structured Scoring Data**
- Machine-readable JSON format
- Contains scoring weights by experience level (entry/mid/senior)
- Defines evaluation categories and checks
- Used to apply experience-level-specific scoring weights

### `resume_evaluation_criteria.md`
**Comprehensive Reference Guide**
- Detailed explanations of all criteria
- Examples and best practices
- FAANG-specific requirements
- Human-readable reference documentation

### `README.md`
**Usage Documentation**
- Explains how to use these files
- Integration examples
- Best practices

## How It Works

1. **System Prompt**: `ai_resume_evaluator_prompt.md` is loaded and used as the OpenAI system message
2. **Scoring Weights**: `resume_criteria_structured.json` provides weights based on experience level:
   - Entry-level: 20% projects, 20% skills, 20% content quality
   - Mid-level: 30% content quality, 25% keywords, 15% ATS
   - Senior: 35% content quality, 25% keywords, 15% skills
3. **Evaluation**: The AI uses the comprehensive criteria to evaluate resumes
4. **Feedback**: Results align with industry standards and provide actionable improvements

## Integration

These files are loaded by `backend/src/services/criteriaService.ts`:
- Files are cached in memory after first load
- System gracefully degrades if files are missing
- Logs warnings if criteria cannot be loaded

## Maintenance

- Update criteria files quarterly to reflect industry changes
- Keep scoring weights aligned with current hiring practices
- Ensure examples remain relevant and current

## Source

These criteria are compiled from:
- FAANG hiring standards
- Google's re:Work resources
- ATS best practices
- Industry-leading resume evaluation frameworks
