import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadResume, critiqueResume, getResumeBlocks } from '../controllers/resumeController';
import { getJobApplicationStats, suggestJobMatches, getUpcomingDeadlines } from '../controllers/jobApplicationController';
import { chatWithAI } from '../controllers/chatController';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../controllers/questionsController';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Upload endpoint - simple and clean
router.post('/resume/upload', upload.single('file'), uploadResume);

// Other routes
router.post('/resume/critique', upload.single('file'), critiqueResume);
router.post('/resume/blocks/alternatives', getResumeBlocks);

// Job Application routes (optional - frontend uses Firestore directly)
router.get('/job-applications/stats', getJobApplicationStats);
router.post('/job-applications/suggest-matches', suggestJobMatches);
router.get('/job-applications/deadlines', getUpcomingDeadlines);

// Chat endpoint
router.post('/chat', chatWithAI);

// Questions endpoint
router.post('/questions/generate', upload.single('resume'), generateInterviewQuestions);
router.post('/questions/evaluate-answer', evaluateInterviewAnswer);

export default router;
