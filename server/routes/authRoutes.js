import { Router } from 'express';
import { register, checkAvailability, getUserImage, login, loginWithText, getMe, setupDecoy, resetGraphicalPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkLockout } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/user-image/:username', getUserImage);
router.post('/check-availability', checkAvailability);
router.post('/register', register);
router.post('/login', checkLockout, login);
router.post('/login-text', loginWithText);
router.get('/me', protect, getMe);
router.post('/setup-decoy', protect, setupDecoy);
router.post('/reset-graphical-password', protect, resetGraphicalPassword);

export default router;
