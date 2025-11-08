export type ComponentType = 'resume' | 'section' | 'job' | 'bullet';

export interface ResumeComponent {
  id: string;
  type: ComponentType;
  title: string;
  content: string;
  children?: ResumeComponent[];
  metadata?: {
    company?: string;
    position?: string;
    dates?: string;
    location?: string;
  };
}

export interface AIAnalysis {
  score: number;
  clarity: number;
  impact: number;
  atsScore: number;
  suggestions: AISuggestion[];
  rewrittenVersion?: string;
}

export interface AISuggestion {
  id: string;
  type: 'clarity' | 'impact' | 'ats' | 'grammar' | 'format';
  title: string;
  description: string;
  original: string;
  improved: string;
  applied: boolean;
}

export interface FocusPath {
  componentId: string;
  level: number;
}

