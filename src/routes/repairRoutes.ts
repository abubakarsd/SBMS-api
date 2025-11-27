import express from 'express';
import { getRepairs, createRepair, updateStatus } from '../controllers/repairController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getRepairs);
router.post('/', authenticateToken, createRepair);
router.patch('/:id/status', authenticateToken, updateStatus);

export default router;
