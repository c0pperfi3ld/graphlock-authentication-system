import { Router } from 'express';
import {
  getUsers,
  deleteUser,
  toggleUserLock,
  updateUserRole,
  getUserVault,
  getHeatmapData,
  getStats,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/users', protect, adminOnly, getUsers);
router.delete('/users/:userId', protect, adminOnly, deleteUser);
router.put('/users/:userId/lock', protect, adminOnly, toggleUserLock);
router.put('/users/:userId/role', protect, adminOnly, updateUserRole);
router.get('/users/:userId/vault', protect, adminOnly, getUserVault);

router.get('/heatmap-data/:imageId', protect, adminOnly, getHeatmapData);
router.get('/stats', protect, adminOnly, getStats);

export default router;
