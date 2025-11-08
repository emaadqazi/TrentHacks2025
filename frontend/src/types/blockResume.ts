export interface BulletPoint {
  id: string;
  text: string;
  highlights?: string[];
}

export interface JobBlock {
  id: string;
  company: string;
  title: string;
  location: string;
  dateRange: string;
  bullets: BulletPoint[];
}

export type ZoomLevel = 'overview' | 'block' | 'component';

export interface ComponentFocus {
  blockId: string;
  componentType: 'company' | 'title' | 'location' | 'date' | 'bullet';
  componentId?: string; // For bullets
}

