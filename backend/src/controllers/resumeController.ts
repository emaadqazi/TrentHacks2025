import { Request, Response } from 'express';
import { parseTextToResume } from '../services/pdfParser';

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
    console.log('📄 First 500 chars of text:', pdfData.text.substring(0, 500));

    // Parse into component-based structure
    const parsedResume = parseTextToResume(pdfData.text);

    console.log('📦 Parsed resume object:', JSON.stringify(parsedResume, null, 2));

    const totalEntries = 
      parsedResume.experience.length + 
      parsedResume.education.length + 
      parsedResume.skills.length +
      parsedResume.projects.length;

    console.log('✅ Parsed resume:', {
      experience: parsedResume.experience.length,
      education: parsedResume.education.length,
      skills: parsedResume.skills.length,
      projects: parsedResume.projects.length
    });

    res.json({
      success: true,
      ...parsedResume,
      metadata: {
        totalEntries,
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
  res.json({ message: 'Resume critique endpoint' });
};

export const getResumeBlocks = async (req: Request, res: Response) => {
  res.json({ message: 'Get resume blocks endpoint' });
};
