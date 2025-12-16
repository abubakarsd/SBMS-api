import express from 'express';
import { getProfile, updateProfile, changePassword, getUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Admin User Management Routes
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
