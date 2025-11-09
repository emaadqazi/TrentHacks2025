const { v4: uuidv4 } = require('uuid');

// Component-based resume types
export interface ContactHeader {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  website?: string;
  location?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  order: number;
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field?: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  order: number;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
  order: number;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  order: number;
}

export interface ParsedResume {
  header: ContactHeader;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  certifications: string[];
}

const BULLET_PREFIXES = ['•', '◦', '▪', '○', '●', '-', '–', '—', '*'];

const SECTION_KEYWORDS = {
  experience: ['experience', 'work history', 'employment', 'professional experience', 'work experience'],
  education: ['education', 'academic', 'degree'],
  skills: ['skills', 'technical skills', 'competencies', 'technologies'],
  projects: ['projects', 'portfolio'],
  certifications: ['certifications', 'certificates', 'credentials'],
};

/**
 * Check if a line starts with a bullet point marker
 */
function isBulletLine(line: string): boolean {
  if (!line) return false;
  const trimmed = line.trim();
  
  for (const prefix of BULLET_PREFIXES) {
    if (trimmed.startsWith(prefix) || trimmed.startsWith(`${prefix} `)) return true;
  }
  
  if (/^\d+[\.\)]\s/.test(trimmed)) return true;
  
  return false;
}

/**
 * Remove bullet markers from the beginning of a line
 */
function cleanBulletText(line: string): string {
  let cleaned = line.trim();
  cleaned = cleaned.replace(/^[•◦▪○●\-–—\*]+\s*/, '');
  cleaned = cleaned.replace(/^\d+[\.\)]\s*/, '');
  return cleaned.trim();
}

/**
 * Detect if a line is likely a section heading (all caps, short)
 */
function isSectionHeading(line: string): boolean {
  const trimmed = line.trim();
  
  if (!trimmed || trimmed.length < 3 || trimmed.length > 50) return false;
  
  if (trimmed === trimmed.toUpperCase()) {
    const letters = trimmed.replace(/[^A-Z]/g, '');
    return letters.length >= 3;
  }
  
  return false;
}

/**
 * Detect if a line contains a date or date range
 */
function isDateLine(line: string): boolean {
  const trimmed = line.trim();
  const datePatterns = [
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}/i,
    /\b\d{4}\s*[-–—]\s*\d{4}\b/,
    /\b\d{4}\s*[-–—]\s*(Present|Current)/i,
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–—]/i,
  ];
  return datePatterns.some(pattern => pattern.test(trimmed));
}

/**
 * Extract date range from a line (returns {startDate, endDate})
 */
function extractDates(line: string): { startDate: string; endDate: string } | null {
  const dateRangePattern = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–—]\s*(Present|Current)/i;
  const match = line.match(dateRangePattern);
  
  if (match) {
    const parts = match[0].split(/[-–—]/);
    return {
      startDate: parts[0].trim(),
      endDate: parts[1].trim()
    };
  }
  
  // Try single date for education
  const singleDatePattern = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}|Summer\s+\d{4}|Fall\s+\d{4}|Spring\s+\d{4}|Winter\s+\d{4}/i;
  const singleMatch = line.match(singleDatePattern);
  if (singleMatch) {
    return {
      startDate: singleMatch[0].trim(),
      endDate: singleMatch[0].trim()
    };
  }
  
  return null;
}

/**
 * Extract email from text
 */
function extractEmail(text: string): string | undefined {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailPattern);
  return match ? match[0] : undefined;
}

/**
 * Extract phone from text
 */
function extractPhone(text: string): string | undefined {
  const phonePattern = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phonePattern);
  return match ? match[0] : undefined;
}

/**
 * Extract LinkedIn URL
 */
function extractLinkedIn(text: string): string | undefined {
  const linkedInPattern = /linkedin\.com\/in\/[a-zA-Z0-9-]+/i;
  const match = text.match(linkedInPattern);
  return match ? `https://${match[0]}` : undefined;
}

/**
 * Extract GitHub URL
 */
function extractGitHub(text: string): string | undefined {
  const githubPattern = /github\.com\/[a-zA-Z0-9-]+/i;
  const match = text.match(githubPattern);
  return match ? `https://${match[0]}` : undefined;
}

/**
 * Determine section type from heading text
 */
function getSectionType(headingText: string): 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'unknown' {
  const lower = headingText.toLowerCase();
  
  for (const [type, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return type as any;
    }
  }
  
  return 'unknown';
}

/**
 * Parse text into component-based resume structure
 */
export function parseTextToResume(text: string): ParsedResume {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const result: ParsedResume = {
    header: {
      name: '',
      email: '',
      phone: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: []
  };
  
  // Extract header info from first few lines
  const headerText = lines.slice(0, 5).join(' ');
  result.header.name = lines[0] || '';
  result.header.email = extractEmail(headerText) || '';
  result.header.phone = extractPhone(headerText) || '';
  result.header.linkedin = extractLinkedIn(headerText);
  result.header.github = extractGitHub(headerText);
  
  let currentSection: string = '';
  let currentExperience: Partial<ExperienceEntry> | null = null;
  let currentEducation: Partial<EducationEntry> | null = null;
  let currentProject: Partial<ProjectEntry> | null = null;
  let pendingLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is a section heading
    if (isSectionHeading(line)) {
      // Finalize any pending items
      if (currentExperience) {
        if (currentExperience.company && currentExperience.role) {
          result.experience.push({
            id: uuidv4(),
            company: currentExperience.company,
            role: currentExperience.role,
            location: currentExperience.location || '',
            startDate: currentExperience.startDate || '',
            endDate: currentExperience.endDate || '',
            bullets: currentExperience.bullets || [],
            order: result.experience.length
          });
        }
        currentExperience = null;
      }
      
      if (currentEducation) {
        if (currentEducation.school) {
          result.education.push({
            id: uuidv4(),
            school: currentEducation.school,
            degree: currentEducation.degree || '',
            field: currentEducation.field,
            location: currentEducation.location || '',
            graduationDate: currentEducation.graduationDate || '',
            gpa: currentEducation.gpa,
            order: result.education.length
          });
        }
        currentEducation = null;
      }
      
      if (currentProject) {
        if (currentProject.name) {
          result.projects.push({
            id: uuidv4(),
            name: currentProject.name,
            description: currentProject.description || '',
            technologies: currentProject.technologies || [],
            link: currentProject.link,
            order: result.projects.length
          });
        }
        currentProject = null;
      }
      
      currentSection = getSectionType(line);
      pendingLines = [];
      continue;
    }
    
    // Process based on current section
    if (currentSection === 'experience') {
      if (isBulletLine(line)) {
        if (!currentExperience) {
          currentExperience = { bullets: [] };
        }
        currentExperience.bullets = currentExperience.bullets || [];
        currentExperience.bullets.push(cleanBulletText(line));
      } else {
        // Check if this starts a new experience entry
        const dates = extractDates(line);
        if (dates) {
          // Finalize previous experience
          if (currentExperience && currentExperience.company && currentExperience.role) {
            result.experience.push({
              id: uuidv4(),
              company: currentExperience.company,
              role: currentExperience.role,
              location: currentExperience.location || '',
              startDate: currentExperience.startDate || '',
              endDate: currentExperience.endDate || '',
              bullets: currentExperience.bullets || [],
              order: result.experience.length
            });
          }
          
          // Start new experience
          currentExperience = {
            startDate: dates.startDate,
            endDate: dates.endDate,
            bullets: []
          };
          
          // Try to extract location from same line
          const parts = line.split(/[-–—]/);
          if (parts.length > 2) {
            const locationPart = parts[parts.length - 1].replace(dates.endDate, '').trim();
            if (locationPart && locationPart.length < 50) {
              currentExperience.location = locationPart;
            }
          }
        } else if (!isDateLine(line) && line.length < 100) {
          // This might be company/role line
          if (!currentExperience) {
            currentExperience = { bullets: [] };
          }
          
          if (!currentExperience.company) {
            currentExperience.company = line;
          } else if (!currentExperience.role) {
            currentExperience.role = line;
          } else if (!currentExperience.location && !line.includes('•')) {
            currentExperience.location = line;
          }
        }
      }
    } else if (currentSection === 'education') {
      if (!currentEducation) {
        currentEducation = {};
      }
      
      const dates = extractDates(line);
      if (dates) {
        currentEducation.graduationDate = dates.endDate;
        
        // Extract location from same line if present
        const locationMatch = line.match(/([A-Z][a-z]+,\s*[A-Z][a-z]+)/);
        if (locationMatch) {
          currentEducation.location = locationMatch[1];
        }
      } else if (!currentEducation.school && !isBulletLine(line)) {
        currentEducation.school = line;
      } else if (!currentEducation.degree && !isBulletLine(line) && line.length < 150) {
        currentEducation.degree = line;
      }
    } else if (currentSection === 'skills') {
      // Skills are often "Category: skill1, skill2, skill3"
      if (line.includes(':')) {
        const parts = line.split(':');
        const category = parts[0].trim();
        const skillsText = parts.slice(1).join(':').trim();
        const skills = skillsText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        result.skills.push({
          id: uuidv4(),
          category,
          skills,
          order: result.skills.length
        });
      }
    } else if (currentSection === 'projects') {
      if (isBulletLine(line)) {
        if (!currentProject) {
          currentProject = {};
        }
        const bulletText = cleanBulletText(line);
        currentProject.description = (currentProject.description || '') + ' ' + bulletText;
      } else if (!isBulletLine(line) && line.length < 100) {
        // Finalize previous project
        if (currentProject && currentProject.name) {
          result.projects.push({
            id: uuidv4(),
            name: currentProject.name,
            description: (currentProject.description || '').trim(),
            technologies: currentProject.technologies || [],
            link: currentProject.link,
            order: result.projects.length
          });
        }
        
        // Start new project
        currentProject = { name: line };
      }
    } else if (currentSection === 'certifications') {
      if (!isSectionHeading(line)) {
        result.certifications.push(line);
      }
    }
  }
  
  // Finalize any remaining items
  if (currentExperience && currentExperience.company && currentExperience.role) {
    result.experience.push({
      id: uuidv4(),
      company: currentExperience.company,
      role: currentExperience.role,
      location: currentExperience.location || '',
      startDate: currentExperience.startDate || '',
      endDate: currentExperience.endDate || '',
      bullets: currentExperience.bullets || [],
      order: result.experience.length
    });
  }
  
  if (currentEducation && currentEducation.school) {
    result.education.push({
      id: uuidv4(),
      school: currentEducation.school,
      degree: currentEducation.degree || '',
      field: currentEducation.field,
      location: currentEducation.location || '',
      graduationDate: currentEducation.graduationDate || '',
      gpa: currentEducation.gpa,
      order: result.education.length
    });
  }
  
  if (currentProject && currentProject.name) {
    result.projects.push({
      id: uuidv4(),
      name: currentProject.name,
      description: (currentProject.description || '').trim(),
      technologies: currentProject.technologies || [],
      link: currentProject.link,
      order: result.projects.length
    });
  }
  
  return result;
}
