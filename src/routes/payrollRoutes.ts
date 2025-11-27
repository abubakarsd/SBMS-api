import express from 'express';
import { createPayroll, getPayroll } from '../controllers/payrollController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/generate', authenticateToken, createPayroll);
router.get('/', authenticateToken, getPayroll);

export default router;
