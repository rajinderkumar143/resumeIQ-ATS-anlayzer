import { Router } from 'express';
import { analyzeResume, getAnalysisHistory } from '../controllers/atsController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/analyze', optionalAuth, analyzeResume);
router.get('/history', requireAuth, getAnalysisHistory);

export default router;
