import express from 'express';
import { getStaff, addStaff, updateStaff, deleteStaff } from '../controllers/staffController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getStaff);
router.post('/', authenticateToken, addStaff);
router.put('/:id', authenticateToken, updateStaff);
router.delete('/:id', authenticateToken, deleteStaff);

export default router;
