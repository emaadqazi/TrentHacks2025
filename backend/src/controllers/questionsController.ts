import { Request, Response } from 'express';
import OpenAI from 'openai';

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in backend/.env.local');
  }
  
  return new OpenAI({
    apiKey: apiKey,
  });
}

interface GenerateQuestionsRequest {
  jobTitle: string;
  location: string;
  resumeText: string;
  jobDescription: string;
  resumeFile?: Express.Multer.File;
}

export async function generateInterviewQuestions(req: Request, res: Response) {
  try {
    const { jobTitle, location, resumeText, jobDescription } = req.body;
    const resumeFile = req.file;

    if (!jobTitle || !location || !jobDescription) {
      return res.status(400).json({
        error: 'Missing required fields: jobTitle, location, and jobDescription are required',
      });
    }

    // Extract text from resume file if provided
    let extractedResumeText = resumeText || '';
    if (resumeFile && resumeFile.buffer) {
      try {
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(resumeFile.buffer);
        extractedResumeText = pdfData.text;
      } catch (error) {
        console.error('Error parsing PDF:', error);
        // Continue with provided resumeText if PDF parsing fails
      }
    }

    if (!extractedResumeText && !resumeFile) {
      return res.status(400).json({
        error: 'Resume text or file is required',
      });
    }

    const openai = getOpenAIClient();

    const prompt = `You are an expert interview coach. Based on the following information, generate exactly 10 highly relevant interview questions that would likely be asked for this position.

Job Title: ${jobTitle}
Location: ${location}
Job Description:
${jobDescription}

Resume/CV Content:
${extractedResumeText}

Generate 10 interview questions that:
1. Are specific to this role and company
2. Test both technical skills and cultural fit
3. Are based on the candidate's resume and the job requirements
4. Include behavioral, technical, and situational questions
5. Are realistic and commonly asked in interviews for similar positions

Return ONLY a JSON array of strings, where each string is one interview question. Do not include any other text or explanation.

Example format:
["Question 1 here?", "Question 2 here?", "Question 3 here?", ...]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview coach. Generate exactly 10 relevant interview questions based on the provided job description and resume. Return only a JSON array of strings.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0]?.message?.content || '';
    
    // Try to parse JSON array from response
    let questions: string[] = [];
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      questions = JSON.parse(cleanedContent);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
      
      // Ensure we have exactly 10 questions
      if (questions.length > 10) {
        questions = questions.slice(0, 10);
      }
      
      // If we have fewer than 10, pad with generic questions
      while (questions.length < 10) {
        questions.push(`Tell me about a challenging project you worked on related to ${jobTitle}.`);
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Response content:', responseContent);
      
      // Fallback: try to extract questions from text
      const lines = responseContent.split('\n').filter(line => line.trim().length > 0);
      questions = lines
        .filter(line => line.includes('?') || line.match(/^\d+[\.\)]/))
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(q => q.length > 10)
        .slice(0, 10);
      
      // If still no questions, use fallback
      if (questions.length === 0) {
        questions = [
          `Why are you interested in the ${jobTitle} position at this company?`,
          `What relevant experience do you have for this role?`,
          `Tell me about a challenging project you've worked on.`,
          `How do you handle tight deadlines and multiple priorities?`,
          `What are your greatest strengths for this position?`,
          `Describe a time when you had to learn a new technology quickly.`,
          `How do you approach problem-solving in your work?`,
          `What interests you most about this role?`,
          `Tell me about a time you worked in a team environment.`,
          `Where do you see yourself in 5 years?`,
        ];
      }
    }

    // Format questions with IDs
    const formattedQuestions = questions.map((question, index) => ({
      id: `q-${index + 1}`,
      question: question.trim(),
    }));

    res.json({
      questions: formattedQuestions,
    });
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate interview questions',
    });
  }
}

