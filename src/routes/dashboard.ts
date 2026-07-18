import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.use(requireAuth);
router.get('/', getDashboardStats);

export default router;
