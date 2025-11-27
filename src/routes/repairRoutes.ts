import express from 'express';
import { getRepairs, getRepairByKey, createRepair, updateRepair, updateStatus, deleteRepair } from '../controllers/repairController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getRepairs);
router.get('/key/:bookingKey', getRepairByKey); // Public route for customers to check status
router.post('/', authenticateToken, createRepair);
router.put('/:id', authenticateToken, updateRepair);
router.patch('/:id/status', authenticateToken, updateStatus);
router.delete('/:id', authenticateToken, deleteRepair);

export default router;
