import type { ResumeComponent, AIAnalysis, AISuggestion } from '@/types/resume';

// Mock AI analysis - In production, this would call the Anthropic API
export async function analyzeComponent(
  component: ResumeComponent,
  context: string[]
): Promise<AIAnalysis> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const suggestions: AISuggestion[] = [];

  if (component.type === 'bullet') {
    // Generate contextual suggestions based on content
    if (!component.content.includes('quantifiable')) {
      suggestions.push({
        id: `sugg-${component.id}-1`,
        type: 'impact',
        title: 'Add quantifiable results',
        description: 'Include specific numbers or percentages to demonstrate impact',
        original: component.content,
        improved: addMetrics(component.content),
        applied: false,
      });
    }

    if (!startsWithActionVerb(component.content)) {
      suggestions.push({
        id: `sugg-${component.id}-2`,
        type: 'clarity',
        title: 'Start with strong action verb',
        description: 'Begin with a powerful action verb to show ownership',
        original: component.content,
        improved: improveActionVerb(component.content),
        applied: false,
      });
    }

    if (component.content.length > 150) {
      suggestions.push({
        id: `sugg-${component.id}-3`,
        type: 'ats',
        title: 'Shorten for ATS optimization',
        description: 'Keep bullet points concise for better ATS parsing',
        original: component.content,
        improved: component.content.substring(0, 130) + '...',
        applied: false,
      });
    }

    if (hasPassiveVoice(component.content)) {
      suggestions.push({
        id: `sugg-${component.id}-4`,
        type: 'grammar',
        title: 'Use active voice',
        description: 'Active voice is more impactful and direct',
        original: component.content,
        improved: convertToActiveVoice(component.content),
        applied: false,
      });
    }
  }

  // Calculate scores
  const clarity = calculateClarityScore(component);
  const impact = calculateImpactScore(component);
  const atsScore = calculateATSScore(component);
  const score = Math.round((clarity + impact + atsScore) / 3);

  return {
    score,
    clarity,
    impact,
    atsScore,
    suggestions: suggestions.slice(0, 5), // Max 5 suggestions
    rewrittenVersion: suggestions.length > 0 ? generateRewrite(component) : undefined,
  };
}

function addMetrics(content: string): string {
  // Add example metrics
  return content.replace(/improved/i, 'improved by 35%')
    .replace(/reduced/i, 'reduced by 40%')
    .replace(/increased/i, 'increased by 50%');
}

function startsWithActionVerb(content: string): boolean {
  const actionVerbs = ['led', 'built', 'implemented', 'developed', 'created', 'managed', 'designed', 'optimized', 'improved', 'reduced', 'increased', 'achieved', 'delivered', 'launched'];
  const firstWord = content.toLowerCase().split(' ')[0];
  return actionVerbs.some(verb => firstWord.includes(verb));
}

function improveActionVerb(content: string): string {
  const improvements: { [key: string]: string } = {
    'was responsible for': 'Led',
    'worked on': 'Developed',
    'helped with': 'Contributed to',
    'did': 'Executed',
    'made': 'Created',
  };

  let improved = content;
  for (const [weak, strong] of Object.entries(improvements)) {
    improved = improved.replace(new RegExp(weak, 'i'), strong);
  }
  return improved;
}

function hasPassiveVoice(content: string): boolean {
  return /was |were |been |being /.test(content.toLowerCase());
}

function convertToActiveVoice(content: string): string {
  return content
    .replace(/was responsible for/gi, 'Led')
    .replace(/were implemented/gi, 'Implemented')
    .replace(/was created/gi, 'Created');
}

function calculateClarityScore(component: ResumeComponent): number {
  let score = 100;
  
  // Deduct points for unclear language
  if (component.content.includes('various') || component.content.includes('multiple')) score -= 10;
  if (component.content.length > 150) score -= 15;
  if (!startsWithActionVerb(component.content) && component.type === 'bullet') score -= 20;
  
  return Math.max(0, score);
}

function calculateImpactScore(component: ResumeComponent): number {
  let score = 60; // Base score
  
  // Add points for quantifiable results
  if (/\d+%|\d+[KM]?\+|\$\d+/.test(component.content)) score += 25;
  if (startsWithActionVerb(component.content)) score += 15;
  
  return Math.min(100, score);
}

function calculateATSScore(component: ResumeComponent): number {
  let score = 80; // Base score
  
  // Check for ATS-friendly characteristics
  if (component.content.length <= 150) score += 10;
  if (!hasPassiveVoice(component.content)) score += 10;
  if (component.type === 'bullet' && component.content.split(' ').length >= 10) score -= 5;
  
  return Math.min(100, Math.max(0, score));
}

function generateRewrite(component: ResumeComponent): string {
  let rewritten = component.content;
  
  // Apply all improvements
  rewritten = improveActionVerb(rewritten);
  rewritten = addMetrics(rewritten);
  rewritten = convertToActiveVoice(rewritten);
  
  return rewritten;
}

export function findComponentById(
  component: ResumeComponent,
  id: string
): ResumeComponent | null {
  if (component.id === id) return component;
  
  if (component.children) {
    for (const child of component.children) {
      const found = findComponentById(child, id);
      if (found) return found;
    }
  }
  
  return null;
}

export function getContextPath(
  component: ResumeComponent,
  targetId: string,
  path: string[] = []
): string[] | null {
  if (component.id === targetId) {
    return [...path, component.title];
  }
  
  if (component.children) {
    for (const child of component.children) {
      const found = getContextPath(child, targetId, [...path, component.title]);
      if (found) return found;
    }
  }
  
  return null;
}

