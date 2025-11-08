import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadResume, critiqueResume, getResumeBlocks } from '../controllers/resumeController';

const router = Router();

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'ResuBlocks API is running' });
});

// Resume routes
router.post('/resume/upload', upload.single('file'), uploadResume);
router.post('/resume/critique', critiqueResume);
router.post('/resume/blocks/alternatives', getResumeBlocks);

// Job routes
router.post('/jobs/scrape', async (req: Request, res: Response) => {
  // TODO: Implement job scraping
  res.json({ message: 'Job scraping endpoint' });
});

export default router;

