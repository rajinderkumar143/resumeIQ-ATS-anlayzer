import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', requireAuth, getDashboardAnalytics);

export default router;
