import express from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getBrands);
router.post('/', authenticateToken, createBrand);
router.put('/:id', authenticateToken, updateBrand);
router.delete('/:id', authenticateToken, deleteBrand);

export default router;
