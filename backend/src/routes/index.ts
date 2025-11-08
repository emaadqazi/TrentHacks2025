import { Router, Request, Response } from 'express';
import { uploadResume, critiqueResume, getResumeBlocks } from '../controllers/resumeController';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'ResuBlocks API is running' });
});

// Resume routes
router.post('/resume/upload', uploadResume);
router.post('/resume/critique', critiqueResume);
router.post('/resume/blocks/alternatives', getResumeBlocks);

// Job routes
router.post('/jobs/scrape', async (req: Request, res: Response) => {
  // TODO: Implement job scraping
  res.json({ message: 'Job scraping endpoint' });
});

export default router;

