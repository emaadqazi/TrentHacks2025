import OpenAI from 'openai';
import { loadEvaluationCriteria } from './criteriaService';
import { loadReferenceResumes } from './referenceResumeService';

// Get API key from environment variables (support both naming conventions)
// Don't initialize OpenAI here - check at runtime since dotenv loads after module import
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY or OPEN_AI_KEY in backend/.env.local');
  }
  
  return new OpenAI({
    apiKey: apiKey,
  });
}

export interface ResumeCritique {
  score: {
    overall: number;
    clarity: number;
    impact: number;
    atsScore: number;
    formatting: number;
    content: number;
  };
  suggestions: Array<{
    id: string;
    category: 'strength' | 'weakness' | 'improvement';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

export async function critiqueResumeWithAI(
  resumeText: string,
  jobTitle?: string,
  experienceLevel?: 'entry' | 'mid' | 'senior'
): Promise<ResumeCritique> {
  // Get OpenAI client at runtime to ensure env vars are loaded
  const openai = getOpenAIClient();

  // Load evaluation criteria (cached after first load)
  const { systemPrompt, criteria } = await loadEvaluationCriteria();
  
  // Load reference resumes based on job title
  const referenceTexts = await loadReferenceResumes(jobTitle);
  
  // Determine experience level (default to 'mid' if not provided)
  const level = experienceLevel || 'mid';
  
  // Extract scoring weights from criteria JSON if available
  let weightInfo = '';
  if (criteria?.resume_evaluation_criteria?.weight_distribution) {
    const weights = criteria.resume_evaluation_criteria.weight_distribution;
    const levelKey = level === 'entry' ? 'entry_level' : level === 'senior' ? 'senior' : 'mid_level';
    const levelWeights = weights[levelKey];
    
    if (levelWeights) {
      weightInfo = `\n\nScoring Weights for ${level} level:\n${JSON.stringify(levelWeights, null, 2)}`;
    }
  }

  // Build user message with resume text and optional reference comparison
  let userMessage = `Evaluate this resume:\n\n${resumeText}`;
  
  // Add reference resume comparison if available
  if (referenceTexts.length > 0) {
    userMessage += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOMPARE AGAINST THESE INDUSTRY-STANDARD REFERENCE RESUMES:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    referenceTexts.forEach((text, idx) => {
      userMessage += `--- Reference Resume ${idx + 1} (Industry Standard) ---\n${text}\n\n`;
    });
    
    userMessage += `COMPARISON INSTRUCTIONS:\n`;
    userMessage += `- Compare the user's resume against these industry-standard examples\n`;
    userMessage += `- Identify specific gaps where the user's resume falls short compared to these references\n`;
    userMessage += `- Highlight what successful resumes do that the user's resume is missing\n`;
    userMessage += `- Provide concrete examples from the reference resumes that the user should emulate\n`;
    userMessage += `- Be specific about formatting, structure, content depth, and impact metrics\n\n`;
  }
  
  // Add experience level and job title context
  userMessage += `Experience Level: ${level}\n`;
  if (jobTitle) {
    userMessage += `Target Role: ${jobTitle}\n`;
  }
  
  // Add weight information if available
  if (weightInfo) {
    userMessage += weightInfo;
  }
  
  userMessage += `\n\nUse the evaluation framework from the system prompt. Apply the scoring weights for ${level} level from the criteria.`;
  userMessage += `\n\nPlease provide a detailed analysis in the following JSON format:\n`;
  userMessage += `{\n`;
  userMessage += `  "score": {\n`;
  userMessage += `    "overall": <number between 0-100>,\n`;
  userMessage += `    "clarity": <number between 0-100>,\n`;
  userMessage += `    "impact": <number between 0-100>,\n`;
  userMessage += `    "atsScore": <number between 0-100>,\n`;
  userMessage += `    "formatting": <number between 0-100>,\n`;
  userMessage += `    "content": <number between 0-100>\n`;
  userMessage += `  },\n`;
  userMessage += `  "suggestions": [\n`;
  userMessage += `    {\n`;
  userMessage += `      "id": "1",\n`;
  userMessage += `      "category": "strength" | "weakness" | "improvement",\n`;
  userMessage += `      "title": "<brief title>",\n`;
  userMessage += `      "description": "<detailed description with specific examples from reference resumes when applicable>",\n`;
  userMessage += `      "priority": "high" | "medium" | "low"\n`;
  userMessage += `    }\n`;
  userMessage += `  ],\n`;
  userMessage += `  "strengths": ["<strength 1>", "<strength 2>", ...],\n`;
  userMessage += `  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],\n`;
  userMessage += `  "summary": "<2-3 sentence summary comparing against industry standards>"\n`;
  userMessage += `}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using gpt-4o-mini for cost-effectiveness, can switch to gpt-4 if needed
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are an expert resume reviewer. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent scoring
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const critique = JSON.parse(responseText) as ResumeCritique;

    // Validate and ensure scores are within range
    const validateScore = (score: number): number => {
      return Math.max(0, Math.min(100, Math.round(score)));
    };

    critique.score.overall = validateScore(critique.score.overall);
    critique.score.clarity = validateScore(critique.score.clarity);
    critique.score.impact = validateScore(critique.score.impact);
    critique.score.atsScore = validateScore(critique.score.atsScore);
    critique.score.formatting = validateScore(critique.score.formatting);
    critique.score.content = validateScore(critique.score.content);

    // Ensure we have at least some suggestions
    if (!critique.suggestions || critique.suggestions.length === 0) {
      critique.suggestions = [
        {
          id: '1',
          category: 'improvement',
          title: 'Review Resume',
          description: 'Consider reviewing your resume for additional improvements.',
          priority: 'medium',
        },
      ];
    }

    // Ensure we have strengths and weaknesses
    if (!critique.strengths || critique.strengths.length === 0) {
      critique.strengths = ['Well-structured resume'];
    }
    if (!critique.weaknesses || critique.weaknesses.length === 0) {
      critique.weaknesses = ['Consider adding more detail'];
    }

    return critique;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to analyze resume with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

