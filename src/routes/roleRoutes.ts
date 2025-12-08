import express from 'express';
import { getRoles, createRole, updateRole, deleteRole, initRoles } from '../controllers/roleController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getRoles);
router.post('/init', initRoles);
router.post('/', authenticateToken, createRole);
router.put('/:id', authenticateToken, updateRole);
router.delete('/:id', authenticateToken, deleteRole);

export default router;
