// Core resume data types (from block-editor)

export type BlockStrength = "good" | "ok" | "weak"
export type SectionType = "education" | "experience" | "projects" | "skills" | "summary" | "custom"
export type BlockType = "bullet" | "header" | "meta" | "skill-item"

export interface Block {
  id: string
  type: BlockType
  text: string
  score?: number // 0-100 relevance vs JD
  strength?: BlockStrength // for color-coding
  tags?: string[] // extracted keywords
}

export interface Section {
  id: string
  type: SectionType
  label: string // e.g. "Experience", "Education"
  blocks: Block[]
  order: number
}

export interface Resume {
  id: string
  title: string
  sections: Section[]
  createdAt?: Date
  updatedAt?: Date
}

export interface SuggestionBlock {
  id: string
  forBlockId: string // which original bullet it's improving
  text: string
  score?: number
  reason?: string // short explanation: "Uses stronger verb", etc.
  tags?: string[]
}

export interface JobDescription {
  id: string
  text: string
  keywords: string[]
  requiredSkills: string[]
  preferredSkills: string[]
}

export interface ResumeVersion {
  id: string
  resumeId: string
  versionName: string // e.g. "Company A - SWE Intern"
  jobDescriptionId?: string
  matchScore?: number
  createdAt: Date
}

export interface MatchAnalysis {
  overallScore: number // 0-100
  matchedKeywords: string[]
  missingKeywords: string[]
  strongSections: Section[]
  weakSections: Section[]
}
