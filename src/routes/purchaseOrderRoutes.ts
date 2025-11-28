import express from 'express';
import { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, updateStatus, deletePurchaseOrder } from '../controllers/purchaseOrderController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getPurchaseOrders);
router.post('/', authenticateToken, createPurchaseOrder);
router.put('/:id', authenticateToken, updatePurchaseOrder);
router.patch('/:id/status', authenticateToken, updateStatus);
router.delete('/:id', authenticateToken, deletePurchaseOrder);

export default router;
