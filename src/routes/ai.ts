import express from 'express';
import { createStudyPlan, getSmartRecommendation } from '../controllers/aiController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.use(requireAuth);
router.post('/study-plan', createStudyPlan);
router.post('/recommendation', getSmartRecommendation);

export default router;
