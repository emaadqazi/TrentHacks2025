import { Resume, Section, Block } from '../types/resume'

/**
 * Backend response structure from parse-resume endpoint
 */
interface BackendSection {
  id: string
  type: string
  label: string
  blocks: BackendBlock[]
  order: number
}

interface BackendBlock {
  id: string
  type: string
  text: string
  bullets?: BackendBullet[]
  // Experience-specific fields
  company?: string
  title?: string
  location?: string
  dateRange?: string
  // Education-specific fields
  institution?: string
  degree?: string
  field?: string
  // Project-specific fields
  name?: string
  // Optional fields
  score?: number
  strength?: string
  tags?: string[]
}

interface BackendBullet {
  id: string
  text: string
}

interface BackendResumeResponse {
  sections: BackendSection[]
  resumeId: string
  title: string
  error?: string
}

/**
 * Transform backend response to frontend Resume type
 */
export function transformBackendToResume(
  backendData: BackendResumeResponse
): Resume {
  if (backendData.error) {
    console.error('Backend parsing error:', backendData.error)
  }

  const sections: Section[] = backendData.sections.map((backendSection) => {
    // Transform blocks
    const blocks: Block[] = backendSection.blocks.map((backendBlock) => {
      // Base block structure
      const block: Block = {
        id: backendBlock.id,
        type: backendBlock.type as any, // 'bullet', 'header', 'meta', 'skill-item'
        text: backendBlock.text,
        score: backendBlock.score,
        strength: backendBlock.strength as any,
        tags: backendBlock.tags,
      }

      return block
    })

    // Create section
    const section: Section = {
      id: backendSection.id,
      type: backendSection.type as any,
      label: backendSection.label,
      blocks,
      order: backendSection.order,
    }

    return section
  })

  // Sort sections by order
  sections.sort((a, b) => a.order - b.order)

  const resume: Resume = {
    id: backendData.resumeId,
    title: backendData.title,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return resume
}

/**
 * Transform frontend Resume to backend format for export
 */
export function transformResumeToBackend(resume: Resume): any {
  return {
    resumeId: resume.id,
    title: resume.title,
    sections: resume.sections.map((section) => ({
      id: section.id,
      type: section.type,
      label: section.label,
      order: section.order,
      blocks: section.blocks.map((block) => ({
        id: block.id,
        type: block.type,
        text: block.text,
        score: block.score,
        strength: block.strength,
        tags: block.tags,
      })),
    })),
  }
}

/**
 * Validate that backend response has the expected structure
 */
export function validateBackendResponse(data: any): data is BackendResumeResponse {
  if (!data || typeof data !== 'object') {
    return false
  }

  if (!Array.isArray(data.sections)) {
    return false
  }

  if (typeof data.resumeId !== 'string' || typeof data.title !== 'string') {
    return false
  }

  return true
}
