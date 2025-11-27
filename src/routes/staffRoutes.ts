import express from 'express';
import { getStaff, addStaff } from '../controllers/staffController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getStaff);
router.post('/', authenticateToken, addStaff);

export default router;
