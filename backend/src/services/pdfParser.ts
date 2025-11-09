const { v4: uuidv4 } = require('uuid');

// Block type definition to match frontend
export interface Block {
  id: string;
  type: 'bullet' | 'header' | 'meta' | 'skill-item';
  text: string;
  score?: number;
  strength?: 'good' | 'ok' | 'weak';
  tags?: string[];
}

export interface SubSection {
  id: string;
  title: string;
  blocks: Block[];
  order: number;
}

export interface Section {
  id: string;
  type: 'education' | 'experience' | 'projects' | 'skills' | 'summary' | 'custom';
  label: string;
  blocks: Block[];
  order: number;
  subsections?: SubSection[];
}

const BULLET_PREFIXES = ['•', '◦', '▪', '○', '●', '-', '–', '—', '*'];
const SECTION_KEYWORDS = {
  experience: ['experience', 'work history', 'employment', 'professional experience'],
  education: ['education', 'academic', 'degree'],
  skills: ['skills', 'technical skills', 'competencies', 'technologies'],
  projects: ['projects', 'portfolio'],
  summary: ['summary', 'profile', 'objective', 'about'],
};

/**
 * Check if a line starts with a bullet point marker
 */
function isBulletLine(line: string): boolean {
  if (!line) return false;
  const trimmed = line.trim();
  
  // Check for explicit bullet characters
  for (const prefix of BULLET_PREFIXES) {
    if (trimmed.startsWith(prefix)) return true;
    if (trimmed.startsWith(`${prefix} `)) return true;
  }
  
  // Check for numbered bullets (1. 2. etc)
  if (/^\d+[\.\)]\s/.test(trimmed)) return true;
  
  return false;
}

/**
 * Remove bullet markers from the beginning of a line
 */
function cleanBulletText(line: string): string {
  let cleaned = line.trim();
  
  // Remove bullet characters
  cleaned = cleaned.replace(/^[•◦▪○●\-–—\*]+\s*/, '');
  
  // Remove numbered bullets
  cleaned = cleaned.replace(/^\d+[\.\)]\s*/, '');
  
  return cleaned.trim();
}

/**
 * Detect if a line is likely a section heading
 */
function isSectionHeading(line: string): boolean {
  const trimmed = line.trim();
  
  // Empty line
  if (!trimmed) return false;
  
  // All caps and relatively short (typical section headings)
  if (trimmed === trimmed.toUpperCase() && trimmed.length < 50 && trimmed.length > 2) {
    // Exclude lines that are just abbreviations or have lots of punctuation
    const letters = trimmed.replace(/[^A-Z]/g, '');
    if (letters.length >= 3) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detect if a line is a date or date range (e.g., "Sept 2024 - Apr 2025", "May 2024 – Sept 2024")
 */
function isDateLine(line: string): boolean {
  const trimmed = line.trim();
  
  // Match various date patterns
  const datePatterns = [
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}/i,
    /\b\d{4}\s*[-–—]\s*\d{4}\b/,
    /\b\d{4}\s*[-–—]\s*(Present|Current)/i,
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–—]/i,
  ];
  
  return datePatterns.some(pattern => pattern.test(trimmed));
}

/**
 * Detect if a line is a job/company header (contains | separators or is bold-looking)
 */
function isJobHeader(line: string): boolean {
  const trimmed = line.trim();
  
  // Contains pipe separators (e.g., "Company | Tech1 | Tech2")
  if (trimmed.includes('|') && trimmed.length < 150) {
    return true;
  }
  
  // Short line with capitals at the start (likely a company or job title)
  if (trimmed.length < 100 && trimmed.length > 5) {
    // Check if it starts with capital letter and doesn't end with period
    if (/^[A-Z]/.test(trimmed) && !trimmed.endsWith('.') && !trimmed.includes(',')) {
      // Not a date and not a bullet
      if (!isDateLine(trimmed) && !isBulletLine(trimmed)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Determine section type from heading text
 */
function getSectionType(headingText: string): Section['type'] {
  const lower = headingText.toLowerCase();
  
  for (const [type, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return type as Section['type'];
    }
  }
  
  return 'custom';
}

/**
 * Check if a line is a continuation of the previous bullet (doesn't start with a bullet marker)
 */
function isContinuationLine(line: string): boolean {
  if (!line) return false;
  const trimmed = line.trim();
  
  // If it starts with a bullet marker, it's not a continuation
  if (isBulletLine(trimmed)) return false;
  
  // If it's a section heading, it's not a continuation
  if (isSectionHeading(trimmed)) return false;
  
  // If it's a date, it's not a continuation
  if (isDateLine(trimmed)) return false;
  
  // If it's a job header, it's not a continuation
  if (isJobHeader(trimmed)) return false;
  
  // If it starts with lowercase, likely a continuation
  if (trimmed.length > 0 && /^[a-z]/.test(trimmed)) return true;
  
  // If line is short and doesn't end with period, might be continuation
  if (trimmed.length < 80 && !trimmed.endsWith('.') && !trimmed.endsWith(',')) {
    // But not if it starts with a capital and looks like a header
    if (/^[A-Z][a-z]/.test(trimmed) && trimmed.includes(' ')) {
      return false;
    }
    return true;
  }
  
  return false;
}

/**
 * Parse extracted PDF text into structured blocks organized by sections with subsections
 */
export function parseTextToBlocks(text: string): Section[] {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentSubSection: SubSection | null = null;
  let currentBulletText = '';
  let isAccumulatingBullet = false;
  let pendingHeaders: Block[] = []; // Accumulate headers before first bullet to group as subsection
  
  const finalizeBullet = () => {
    if (currentBulletText) {
      const trimmed = currentBulletText.trim();
      if (trimmed.length > 3) {
        const block: Block = {
          id: uuidv4(),
          type: 'bullet',
          text: trimmed,
        };
        
        // Add to subsection if exists, otherwise to section
        if (currentSubSection) {
          currentSubSection.blocks.push(block);
        } else if (currentSection) {
          currentSection.blocks.push(block);
        }
      }
    }
    currentBulletText = '';
    isAccumulatingBullet = false;
  };
  
  const finalizeSubSection = () => {
    if (currentSubSection && currentSection) {
      // Only finalize if it has content
      if (currentSubSection.blocks.length > 0) {
        if (!currentSection.subsections) {
          currentSection.subsections = [];
        }
        currentSection.subsections.push(currentSubSection);
      }
      currentSubSection = null;
    }
    pendingHeaders = [];
  };
  
  const startNewSubSection = () => {
    // Finalize previous subsection
    finalizeSubSection();
    
    // Create new subsection with pending headers
    if (pendingHeaders.length > 0 && currentSection) {
      const title = pendingHeaders.map(h => h.text).join(' - ');
      currentSubSection = {
        id: uuidv4(),
        title: title,
        blocks: [...pendingHeaders], // Include headers in the subsection
        order: currentSection.subsections?.length || 0,
      };
      pendingHeaders = [];
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is a section heading
    if (isSectionHeading(line)) {
      // Finalize any pending bullet and subsection
      finalizeBullet();
      finalizeSubSection();
      
      // Save current section if it exists
      if (currentSection) {
        if (currentSection.blocks.length > 0 || (currentSection.subsections && currentSection.subsections.length > 0)) {
          sections.push(currentSection);
        }
      }
      
      // Start new section
      const sectionType = getSectionType(line);
      currentSection = {
        id: uuidv4(),
        type: sectionType,
        label: line,
        blocks: [],
        order: sections.length,
      };
      currentSubSection = null;
      pendingHeaders = [];
    } else {
      // If no section yet, create a default "Imported" section
      if (!currentSection) {
        currentSection = {
          id: uuidv4(),
          type: 'custom',
          label: 'Imported Resume',
          blocks: [],
          order: 0,
        };
      }
      
      // Check if this is a new bullet point or a continuation
      if (isBulletLine(line)) {
        // If we have pending headers, this is the first bullet of a new subsection
        if (pendingHeaders.length > 0) {
          startNewSubSection();
        }
        
        // Finalize previous bullet if any
        finalizeBullet();
        
        // Start new bullet
        currentBulletText = cleanBulletText(line);
        isAccumulatingBullet = true;
      } else if (isAccumulatingBullet && isContinuationLine(line)) {
        // This line continues the previous bullet
        currentBulletText += ' ' + line;
      } else {
        // This is a standalone line (not a bullet, not a continuation)
        // Finalize any pending bullet first
        finalizeBullet();
        
        // Determine the type of this line
        const trimmed = line.trim();
        if (trimmed.length > 3) {
          let blockType: Block['type'] = 'header';
          
          // Check if it's metadata (dates, locations, etc.)
          if (isDateLine(trimmed) || trimmed.includes(',')) {
            blockType = 'meta';
          }
          
          const block: Block = {
            id: uuidv4(),
            type: blockType,
            text: trimmed,
          };
          
          // For Experience/Projects sections, accumulate headers to create subsections
          if (currentSection.type === 'experience' || currentSection.type === 'projects' || currentSection.type === 'education') {
            // If we already have a subsection with bullets, this header starts a new subsection
            if (currentSubSection !== null) {
              const subsec = currentSubSection as SubSection;
              if (subsec.blocks.some((b: Block) => b.type === 'bullet')) {
                startNewSubSection();
              }
            }
            
            // Add to pending headers
            pendingHeaders.push(block);
          } else {
            // For other sections, just add directly
            currentSection.blocks.push(block);
          }
        }
      }
    }
  }
  
  // Finalize any remaining bullet and subsection
  finalizeBullet();
  finalizeSubSection();
  
  // Add the last section
  if (currentSection) {
    if (currentSection.blocks.length > 0 || (currentSection.subsections && currentSection.subsections.length > 0)) {
      sections.push(currentSection);
    }
  }
  
  // If no sections were created, return a single default section
  if (sections.length === 0 && lines.length > 0) {
    const defaultSection: Section = {
      id: uuidv4(),
      type: 'custom',
      label: 'Imported Resume',
      blocks: [],
      order: 0,
    };
    
    // Process all lines with bullet grouping
    let tempBullet = '';
    for (const line of lines) {
      if (isBulletLine(line)) {
        if (tempBullet) {
          defaultSection.blocks.push({
            id: uuidv4(),
            type: 'bullet',
            text: tempBullet.trim(),
          });
        }
        tempBullet = cleanBulletText(line);
      } else if (tempBullet && isContinuationLine(line)) {
        tempBullet += ' ' + line;
      } else {
        if (tempBullet) {
          defaultSection.blocks.push({
            id: uuidv4(),
            type: 'bullet',
            text: tempBullet.trim(),
          });
          tempBullet = '';
        }
        defaultSection.blocks.push({
          id: uuidv4(),
          type: 'header',
          text: line,
        });
      }
    }
    
    // Add final bullet if any
    if (tempBullet) {
      defaultSection.blocks.push({
        id: uuidv4(),
        type: 'bullet',
        text: tempBullet.trim(),
      });
    }
    
    sections.push(defaultSection);
  }
  
  return sections;
}

