import { Request, Response } from 'express';
import { parseTextToBlocks } from '../services/pdfParser';

// Parse uploaded PDF resume into blocks
export const uploadResume = async (req: Request, res: Response) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded. Please upload a PDF file.' 
      });
    }

    // Validate file type
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ 
        error: 'Invalid file type. Only PDF files are supported.' 
      });
    }

    // Import pdf-parse v1.1.1 - it exports a function directly
    const pdfParse = require('pdf-parse');
    
    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Could not extract text from PDF. The file might be empty or contain only images.' 
      });
    }

    // Parse text into structured blocks
    const sections = parseTextToBlocks(pdfData.text);

    if (sections.length === 0 || sections.every(s => s.blocks.length === 0)) {
      return res.status(400).json({ 
        error: 'No content could be extracted from the PDF. Please try a different file.' 
      });
    }

    // Count total blocks
    const totalBlocks = sections.reduce((sum, section) => sum + section.blocks.length, 0);

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
    console.error('Error parsing PDF:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      error: 'Failed to parse PDF. Please try another file.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const critiqueResume = async (req: Request, res: Response) => {
  // TODO: Implement resume critique against job description
  res.json({ message: 'Resume critique endpoint' });
};

export const getResumeBlocks = async (req: Request, res: Response) => {
  // TODO: Implement getting resume blocks/alternatives
  res.json({ message: 'Get resume blocks endpoint' });
};

