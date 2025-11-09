// Component-based resume types - replacing block editor structure

// Core resume structure - component-based
export interface Resume {
  id: string
  userId: string
  title: string
  createdAt: Date
  updatedAt: Date
  
  // Contact header
  header: ContactHeader
  
  // Education entries (similar to experience)
  education: EducationEntry[]
  
  // Skills organized by category
  skills: SkillCategory[]
  
  // Work experience entries (the main focus)
  experience: ExperienceEntry[]
  
  // Additional sections
  projects?: ProjectEntry[]
  certifications?: string[]
}

export interface ContactHeader {
  name: string
  email: string
  phone: string
  linkedin?: string
  github?: string
  website?: string
  location?: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  location: string
  startDate: string  // "May 2026" or "May 2026"
  endDate: string    // "September 2027" or "Present"
  bullets: string[]  // Array of bullet points
  order: number      // For reordering
  
  // AI analytics (populated after analysis)
  aiScore?: AIScore
}

export interface AIScore {
  overall: number              // 0-100
  keywordMatch: number         // 0-100
  bulletStrengths: number[]    // One score per bullet
  suggestions: string[]        // Improvement suggestions
  missingKeywords: string[]    // Keywords from JD not in entry
}

export interface EducationEntry {
  id: string
  school: string
  degree: string
  field?: string
  location: string
  graduationDate: string
  gpa?: string
  order: number
}

export interface SkillCategory {
  id: string
  category: string  // "Languages", "Frameworks", etc.
  skills: string[]  // ["Python", "Java", ...]
  order: number
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  technologies: string[]
  link?: string
  order: number
}

// For job description analysis (future feature)
export interface JobDescription {
  id: string
  text: string
  keywords: string[]
  requiredSkills: string[]
  preferredSkills: string[]
}
