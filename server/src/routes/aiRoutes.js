import { Router } from 'express';
import { rewriteBullet, generateCoverLetter, generateInterviewPrep } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/rewrite-bullet', optionalAuth, rewriteBullet);
router.post('/cover-letter', optionalAuth, generateCoverLetter);
router.post('/interview-prep', optionalAuth, generateInterviewPrep);

export default router;
