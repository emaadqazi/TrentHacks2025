import { Request, Response } from 'express';
import { parseTextToBlocks } from '../services/pdfParser';
import { critiqueResumeWithAI } from '../services/openaiService';

export const uploadResume = async (req: Request, res: Response) => {
  try {
    console.log('📤 Upload request received');
    
    // Check for file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('✅ File:', req.file.originalname, req.file.size, 'bytes');

    // Parse PDF
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(req.file.buffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    console.log('✅ Extracted text, length:', pdfData.text.length);

    // Parse into sections
    const sections = parseTextToBlocks(pdfData.text);

    const totalBlocks = sections.reduce((sum, section) => {
      const sectionBlocks = section.blocks.length;
      const subsectionBlocks = section.subsections?.reduce((subSum, sub) => subSum + sub.blocks.length, 0) || 0;
      return sum + sectionBlocks + subsectionBlocks;
    }, 0);

    console.log('✅ Parsed into', sections.length, 'sections,', totalBlocks, 'blocks');

    res.json({
      success: true,
      sections,
      metadata: {
        totalSections: sections.length,
        totalBlocks,
        pages: pdfData.numpages,
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      error: 'Failed to parse PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const critiqueResume = async (req: Request, res: Response) => {
  try {
    console.log('📊 Critique request received');
    
    // Check for file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('✅ File:', req.file.originalname, req.file.size, 'bytes');

    // Parse PDF
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(req.file.buffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    console.log('✅ Extracted text, length:', pdfData.text.length);

    // Check if OpenAI API key is available
    const hasOpenAIKey = !!(process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY);
    
    if (!hasOpenAIKey) {
      console.error('❌ OpenAI API key not found in environment');
      console.error('   Available env vars:', Object.keys(process.env).filter(k => k.includes('OPEN')));
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        details: 'Please set OPENAI_API_KEY or OPEN_AI_KEY in backend/.env.local and restart the server'
      });
    }

    // Extract optional parameters from query
    const jobTitle = req.query.jobTitle as string | undefined;
    const experienceLevel = req.query.experienceLevel as 'entry' | 'mid' | 'senior' | undefined;
    
    // Auto-detect experience level if not provided
    let detectedLevel: 'entry' | 'mid' | 'senior' = experienceLevel || 'mid';
    
    if (!experienceLevel) {
      // Simple heuristic: count years of experience mentioned
      const yearsMatch = pdfData.text.match(/(\d+)\+?\s*(years?|yrs?)/i);
      if (yearsMatch) {
        const years = parseInt(yearsMatch[1]);
        if (years < 2) {
          detectedLevel = 'entry';
        } else if (years >= 5) {
          detectedLevel = 'senior';
        } else {
          detectedLevel = 'mid';
        }
      }
      console.log(`📊 Auto-detected experience level: ${detectedLevel}`);
    }

    if (jobTitle) {
      console.log(`🎯 Target job title: ${jobTitle}`);
    }
    console.log(`📈 Experience level: ${detectedLevel}`);

    console.log('🤖 Using OpenAI for resume critique with industry standards...');
    
    // Use OpenAI for intelligent analysis with criteria and reference comparison
    const critique = await critiqueResumeWithAI(pdfData.text, jobTitle, detectedLevel);
    console.log('✅ AI critique generated, overall score:', critique.score.overall);
    
    res.json(critique);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      error: 'Failed to critique resume with AI',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getResumeBlocks = async (req: Request, res: Response) => {
  res.json({ message: 'Get resume blocks endpoint' });
};
