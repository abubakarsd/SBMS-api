import express from 'express';
import { processSale, getSalesHistory } from '../controllers/saleController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, processSale);
router.get('/', authenticateToken, getSalesHistory);

export default router;
