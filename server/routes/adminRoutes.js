import { Router } from 'express';
import { getUsers, getHeatmapData, getStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/users', protect, adminOnly, getUsers);
router.get('/heatmap-data/:imageId', protect, adminOnly, getHeatmapData);
router.get('/stats', protect, adminOnly, getStats);

export default router;
