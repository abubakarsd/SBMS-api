import express from 'express';
import { processSale, getSalesHistory, updateSaleStatus, updatePaymentStatus } from '../controllers/saleController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, processSale);
router.get('/', authenticateToken, getSalesHistory);
router.patch('/:id/status', authenticateToken, updateSaleStatus);
router.patch('/:id/payment', authenticateToken, updatePaymentStatus);

export default router;
