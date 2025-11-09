import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Load reference resumes based on job title
 * Returns array of extracted text from reference PDF files
 */
export async function loadReferenceResumes(jobTitle?: string): Promise<string[]> {
  try {
    const referenceDir = path.join(__dirname, '../assets/reference-resumes');
    
    // Check if directory exists
    try {
      await fs.access(referenceDir);
    } catch {
      console.warn('Reference resumes directory not found');
      return [];
    }
    
    // Select relevant reference resumes based on job title
    let referenceFiles: string[] = [];
    
    if (jobTitle) {
      const lowerTitle = jobTitle.toLowerCase();
      
      if (lowerTitle.includes('engineer') || lowerTitle.includes('developer') || lowerTitle.includes('swe')) {
        referenceFiles = ['software-engineer.pdf', 'senior-engineer.pdf'];
      } else if (lowerTitle.includes('product') || lowerTitle.includes('pm')) {
        referenceFiles = ['product-manager.pdf'];
      } else if (lowerTitle.includes('data scientist') || lowerTitle.includes('data scientist')) {
        referenceFiles = ['data-scientist.pdf'];
      } else if (lowerTitle.includes('data engineer')) {
        referenceFiles = ['data-engineer.pdf'];
      } else if (lowerTitle.includes('devops') || lowerTitle.includes('sre')) {
        referenceFiles = ['devops-engineer.pdf'];
      } else {
        // Default fallback
        referenceFiles = ['general-example.pdf', 'software-engineer.pdf'];
      }
    } else {
      // No job title provided, use general example
      referenceFiles = ['general-example.pdf', 'software-engineer.pdf'];
    }
    
    const referenceTexts: string[] = [];
    const pdfParse = require('pdf-parse');
    
    for (const file of referenceFiles) {
      try {
        const filePath = path.join(referenceDir, file);
        
        // Check if file exists
        try {
          await fs.access(filePath);
        } catch {
          console.warn(`⚠️ Reference resume not found: ${file}`);
          continue;
        }
        
        const pdfBuffer = await fs.readFile(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        
        if (pdfData.text && pdfData.text.trim().length > 0) {
          referenceTexts.push(pdfData.text);
          console.log(`✅ Loaded reference resume: ${file}`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not load reference resume ${file}:`, error);
      }
    }
    
    if (referenceTexts.length === 0) {
      console.warn('⚠️ No reference resumes loaded, proceeding without comparison');
    } else {
      console.log(`✅ Loaded ${referenceTexts.length} reference resume(s) for comparison`);
    }
    
    return referenceTexts;
  } catch (error) {
    console.warn('⚠️ Error loading reference resumes:', error);
    return [];
  }
}

