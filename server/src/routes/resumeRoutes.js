import { Router } from 'express';
import {
  uploadAndParseResume,
  getResumes,
  getResumeById,
  deleteResume,
} from '../controllers/resumeController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = Router();

// Upload supports optionalAuth (guests can test parser immediately, logged in users have resumes persisted)
router.post('/upload', optionalAuth, uploadResume.single('resume'), uploadAndParseResume);

// Protected resume management endpoints
router.get('/', requireAuth, getResumes);
router.get('/:id', requireAuth, getResumeById);
router.delete('/:id', requireAuth, deleteResume);

export default router;
