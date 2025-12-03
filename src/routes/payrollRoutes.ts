import express from 'express';
import { createPayroll, getPayroll, updatePayrollStatus } from '../controllers/payrollController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, createPayroll);
router.get('/', authenticateToken, getPayroll);
router.patch('/:id/status', authenticateToken, updatePayrollStatus);

export default router;
