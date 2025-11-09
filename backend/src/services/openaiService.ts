import OpenAI from 'openai';

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

export async function critiqueResumeWithAI(resumeText: string): Promise<ResumeCritique> {
  // Get OpenAI client at runtime to ensure env vars are loaded
  const openai = getOpenAIClient();

  const prompt = `You are an expert resume reviewer and career advisor. Analyze the following resume and provide a comprehensive critique.

RESUME TEXT:
${resumeText}

Please provide a detailed analysis in the following JSON format:
{
  "score": {
    "overall": <number between 0-100>,
    "clarity": <number between 0-100>,
    "impact": <number between 0-100>,
    "atsScore": <number between 0-100>,
    "formatting": <number between 0-100>,
    "content": <number between 0-100>
  },
  "suggestions": [
    {
      "id": "1",
      "category": "strength" | "weakness" | "improvement",
      "title": "<brief title>",
      "description": "<detailed description>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "summary": "<2-3 sentence summary of the resume quality and main areas for improvement>"
}

Scoring Guidelines:
- **Overall**: Overall resume quality (0-100)
- **Clarity**: How clear and easy to read the resume is (structure, formatting, organization)
- **Impact**: How impactful the resume is (quantifiable achievements, strong action verbs, compelling descriptions)
- **ATS Score**: How well optimized the resume is for Applicant Tracking Systems (keywords, format compatibility, parsing)
- **Formatting**: Visual presentation and professional appearance
- **Content**: Quality and completeness of content (sections, details, relevance)

Evaluation Criteria:
1. Contact information completeness
2. Professional summary/objective quality
3. Work experience with quantifiable achievements
4. Education section completeness
5. Skills section relevance and organization
6. Use of action verbs
7. Quantifiable metrics and results
8. ATS optimization (keywords, formatting)
9. Overall structure and flow
10. Grammar and spelling

Provide 3-5 suggestions with priorities. Focus on actionable improvements.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using gpt-4o-mini for cost-effectiveness, can switch to gpt-4 if needed
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume reviewer. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
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

