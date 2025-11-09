import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadResume, critiqueResume, getResumeBlocks } from '../controllers/resumeController';

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
router.post('/resume/critique', critiqueResume);
router.post('/resume/blocks/alternatives', getResumeBlocks);

export default router;
