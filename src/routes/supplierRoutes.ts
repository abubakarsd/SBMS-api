import express from 'express';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplierController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getSuppliers);
router.post('/', authenticateToken, createSupplier);
router.put('/:id', authenticateToken, updateSupplier);
router.delete('/:id', authenticateToken, deleteSupplier);

export default router;
