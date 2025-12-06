import express from 'express';
import { getStaff, addStaff, updateStaff, deleteStaff, syncUsersToStaff } from '../controllers/staffController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getStaff);
router.post('/', authenticateToken, addStaff);
router.post('/sync', authenticateToken, syncUsersToStaff);
router.put('/:id', authenticateToken, updateStaff);
router.delete('/:id', authenticateToken, deleteStaff);

export default router;
