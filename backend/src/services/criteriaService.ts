import * as fs from 'fs/promises';
import * as path from 'path';

interface EvaluationCriteria {
  systemPrompt: string;
  criteria: any; // JSON object from resume_criteria_structured.json
}

let cachedCriteria: EvaluationCriteria | null = null;

/**
 * Load evaluation criteria files (cached after first load)
 */
export async function loadEvaluationCriteria(): Promise<EvaluationCriteria> {
  // Return cached version if available
  if (cachedCriteria) {
    return cachedCriteria;
  }

  try {
    const assetsDir = path.join(__dirname, '../assets/evaluation-criteria');
    
    // Load system prompt
    const promptPath = path.join(assetsDir, 'ai_resume_evaluator_prompt.md');
    const systemPrompt = await fs.readFile(promptPath, 'utf-8');
    
    // Load structured criteria JSON
    const criteriaPath = path.join(assetsDir, 'resume_criteria_structured.json');
    const criteriaJson = await fs.readFile(criteriaPath, 'utf-8');
    const criteria = JSON.parse(criteriaJson);
    
    cachedCriteria = {
      systemPrompt,
      criteria,
    };
    
    console.log('✅ Evaluation criteria loaded successfully');
    return cachedCriteria;
  } catch (error) {
    console.warn('⚠️ Failed to load evaluation criteria files:', error);
    console.warn('   Falling back to basic evaluation');
    
    // Return minimal fallback
    return {
      systemPrompt: 'You are an expert resume reviewer. Analyze resumes and provide constructive feedback.',
      criteria: null,
    };
  }
}

