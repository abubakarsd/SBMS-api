import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticateToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/', authenticateToken, getProducts);
router.post('/', authenticateToken, upload.single('image'), addProduct);
router.put('/:id', authenticateToken, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
