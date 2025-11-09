# Resume Evaluation Criteria - Usage Guide

This package contains industry-leading resume evaluation criteria compiled from FAANG hiring standards, Google's rubrics, and ATS best practices.

## 📦 What's Included

### 1. `resume_evaluation_criteria.md` 
**Best for:** Human reference and understanding
- Comprehensive guide with detailed explanations
- Examples for each criterion
- FAANG-specific requirements
- Red flags and common mistakes
- 35+ pages of best practices

**Use this when:**
- You want to understand WHY certain criteria matter
- You're learning about resume best practices
- You need detailed examples
- You're training others on resume standards

---

### 2. `ai_resume_evaluator_prompt.md`
**Best for:** AI integration in Cursor/Claude/ChatGPT
- Condensed system prompt format
- Clear scoring rubrics
- Structured feedback templates
- Ready-to-use with AI tools

**Use this when:**
- Integrating with Cursor AI in your app
- Creating an AI-powered resume evaluator
- You need consistent, automated feedback
- Building a resume review chatbot

**How to use in Cursor:**
```
1. Open your project in Cursor
2. Create a new file or chat context
3. Paste the entire ai_resume_evaluator_prompt.md as context
4. Then prompt with: "Evaluate this resume: [paste resume text]"
5. Add optional job description for better matching
```

---

### 3. `resume_criteria_structured.json`
**Best for:** Programmatic/backend integration
- Machine-readable JSON format
- Structured scoring weights
- Category definitions
- Easy to parse in code

**Use this when:**
- Building a resume evaluation API
- Need to programmatically score resumes
- Integrating with your database
- Creating automated scoring systems

**Example integration:**
```javascript
const criteria = require('./resume_criteria_structured.json');
const weights = criteria.resume_evaluation_criteria.weight_distribution.mid_level;
const atsChecks = criteria.resume_evaluation_criteria.evaluation_categories[0].checks;

// Use the structured data in your evaluation logic
```

---

## 🚀 Quick Start Guide

### For Your Resume App in Cursor

**Option A: Simple Chat Integration**
1. Copy `ai_resume_evaluator_prompt.md` content
2. In Cursor, use it as a system prompt/context
3. Pass resume text + job description
4. Get structured feedback

**Option B: Programmatic API**
1. Use `resume_criteria_structured.json` to build scoring logic
2. Parse resume into sections
3. Score each section against criteria
4. Weight scores by experience level
5. Generate feedback based on issues found

**Option C: Hybrid Approach**
1. Use JSON for structured scoring
2. Use AI prompt for generating specific feedback text
3. Combine for best of both worlds

---

## 📊 Evaluation Framework Overview

### Scoring Scale
- **90-100**: Excellent - Ready to submit
- **80-89**: Good - Minor improvements needed  
- **70-79**: Fair - Several improvements required
- **<70**: Needs significant work

### Weight Distribution

**Entry-Level (<2 years):**
- Keywords: 20%
- Content Quality: 20%
- Skills: 20%
- Projects: 20%
- ATS: 15%
- Education: 5%

**Mid-Level (2-5 years):**
- Content Quality: 30%
- Keywords: 25%
- ATS: 15%
- Skills: 15%
- Experience: 10%
- Other: 5%

**Senior (5+ years):**
- Content Quality: 35%
- Keywords: 25%
- Skills: 15%
- ATS: 10%
- Leadership: 10%
- Other: 5%

---

## 🎯 Key Criteria Highlights

### Critical Requirements (Zero Tolerance)
1. **ATS Compatibility**
   - Single column layout (no multi-column)
   - No graphics/images/tables
   - Standard section headers
   - Simple, clean formatting

2. **Grammar & Spelling**
   - Zero errors allowed
   - Professional tone
   - Consistent formatting

3. **Quantifiable Results**
   - 70%+ bullets should have metrics
   - Numbers, percentages, scale indicators
   - Before/after comparisons

### High Priority
- 70-85% keyword match with job description
- Action verb + task + technology + result format
- 3-5 impactful bullets per job
- GitHub links for projects
- Professional contact information

---

## 💡 Integration Examples

### Example 1: AI Feedback Bot
```typescript
// In your Cursor/AI integration
const systemPrompt = fs.readFileSync('./ai_resume_evaluator_prompt.md', 'utf8');
const resume = userUploadedResume;
const jobDescription = userJobDescription;

const response = await ai.chat({
  system: systemPrompt,
  user: `
    Evaluate this resume:
    ${resume}
    
    Job Description:
    ${jobDescription}
    
    Experience Level: mid-level
  `
});

return response; // Structured feedback with scores
```

### Example 2: Automated Scoring
```javascript
const criteria = require('./resume_criteria_structured.json');

function scoreResume(resume, experienceLevel) {
  const weights = criteria.resume_evaluation_criteria
    .weight_distribution[experienceLevel];
  
  const scores = {
    ats: checkATSCompatibility(resume),
    keywords: checkKeywords(resume, jobDescription),
    content: checkContentQuality(resume),
    // ... other checks
  };
  
  // Calculate weighted total
  const totalScore = Object.keys(weights).reduce((total, key) => {
    return total + (scores[key] * weights[key] / 100);
  }, 0);
  
  return {
    totalScore,
    breakdown: scores,
    issues: identifyIssues(scores)
  };
}
```

---

## 📝 Sample Feedback Output

```
RESUME SCORE: 72/100 - Fair Match

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 CRITICAL ISSUES (Fix immediately)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ATS Compatibility Failure (Score: 8/20)
   Problem: Resume uses 2-column layout that ATS cannot parse
   Impact: 70% chance of automatic rejection
   Fix: Convert to single-column format immediately
   
2. Missing Quantifiable Results (Score: 12/30)
   Problem: Only 3 of 14 bullets include metrics
   Impact: Cannot demonstrate impact to recruiters
   Fix: Add numbers to at least 10 bullets (70% target)
   Example:
   ❌ Before: "Improved website performance"
   ✅ After: "Improved website load time by 45% (3.2s → 1.8s)"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ HIGH PRIORITY (Address soon)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. Low Keyword Match (Score: 15/25)
   Problem: Only 58% match with job description
   Missing: React Native, GraphQL, CI/CD, Agile
   Fix: Add these to Skills section and relevant bullets

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. Add GitHub links to projects
5. Highlight leadership in IBM role
6. Include GPA if >3.5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STRENGTHS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Strong project descriptions
- Relevant internship experience
- Good tech stack variety
```

---

## 🔧 Customization Tips

### Adjust for Your Industry
The criteria are optimized for tech roles but can be adapted:
- **Finance**: Emphasize quantifiable ROI and compliance
- **Marketing**: Highlight campaign metrics and creative skills
- **Healthcare**: Focus on patient outcomes and certifications

### Modify Weights
Edit the JSON to adjust category weights based on your needs:
```json
"mid_level": {
  "ats_compatibility": 20,  // Increase if ATS is critical
  "keywords": 30,           // Increase for strict matching
  "content_quality": 25,    // Adjust based on priorities
  ...
}
```

---

## 📚 Additional Resources

### Mentioned in Criteria
- **Tech Interview Handbook**: techinterviewhandbook.org/resume
- **Google re:Work**: rework.withgoogle.com
- **FAANG Tech Leads**: faangtechleads.com
- **Jobscan ATS Checker**: jobscan.co

### Best Practices
1. **Always tailor** resume to each job description
2. **Test with ATS checkers** before submitting
3. **Get human feedback** in addition to AI
4. **Iterate constantly** based on response rates
5. **Keep it simple** - fancy design hurts more than helps

---

## ❓ FAQ

**Q: Should I use all three files?**
A: Depends on your use case:
- Building an app? Use JSON + AI prompt
- Learning? Use the comprehensive MD
- Quick integration? Use AI prompt only

**Q: Can this guarantee I'll pass ATS?**
A: No guarantees, but following these criteria significantly improves your chances. ATS systems vary by company.

**Q: How often should criteria be updated?**
A: Quarterly review recommended. ATS systems and hiring practices evolve.

**Q: What about non-tech resumes?**
A: Core principles apply (ATS, metrics, format) but adjust technical criteria for your field.

**Q: Is 100% keyword match good?**
A: No! 70-85% is optimal. 100% looks like keyword stuffing.

---

## 🤝 Contributing

Found an improvement or new insight? Update criteria based on:
- Latest ATS system changes
- New FAANG hiring practices
- User feedback from your app
- Industry trend shifts

---

## 📄 License & Usage

These criteria are compiled from public sources and best practices. Free to use in your applications. 

Attribution appreciated but not required.

---

## 🎯 Next Steps

1. Choose the format that fits your needs
2. Integrate into your resume app
3. Test with sample resumes
4. Iterate based on feedback
5. Help users land their dream jobs!

---

**Version**: 1.0
**Last Updated**: November 2025
**Maintained by**: Emaad's Resume Evaluation Project

