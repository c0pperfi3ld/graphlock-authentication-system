import { Router } from 'express';
import { getSessions, revokeSession, revokeAllSessions } from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getSessions);
router.delete('/revoke-all', protect, revokeAllSessions);
router.delete('/:id', protect, revokeSession);

export default router;
