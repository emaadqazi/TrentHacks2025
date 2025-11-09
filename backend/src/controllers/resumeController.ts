import { Request, Response } from 'express';
import { parseTextToBlocks } from '../services/pdfParser';

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
  res.json({ message: 'Resume critique endpoint' });
};

export const getResumeBlocks = async (req: Request, res: Response) => {
  res.json({ message: 'Get resume blocks endpoint' });
};
