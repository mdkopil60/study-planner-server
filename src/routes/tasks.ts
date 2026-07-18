import express from 'express';
import { getTasks, getTaskById, getPublicTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/public', getPublicTasks);
router.get('/public/:id', getTaskById);

// Protected routes
router.use(requireAuth);
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
