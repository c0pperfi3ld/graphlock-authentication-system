import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getCredentials,
  createCredential,
  updateCredential,
  deleteCredential,
} from '../controllers/vaultController.js';

const router = Router();

// Note routes
router.get('/notes', protect, getNotes);
router.post('/notes', protect, createNote);
router.put('/notes/:id', protect, updateNote);
router.delete('/notes/:id', protect, deleteNote);

// Credential routes
router.get('/credentials', protect, getCredentials);
router.post('/credentials', protect, createCredential);
router.put('/credentials/:id', protect, updateCredential);
router.delete('/credentials/:id', protect, deleteCredential);

export default router;
