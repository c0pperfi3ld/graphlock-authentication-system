import mongoose from 'mongoose';
import Note from '../models/Note.js';
import Credential from '../models/Credential.js';

/**
 * GET /api/vault/notes
 * Fetch all notes for the authenticated user sorted by pinned desc then updatedAt desc
 */
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ pinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

/**
 * POST /api/vault/notes
 * Create a new note for the authenticated user
 */
export const createNote = async (req, res) => {
  try {
    const { title, content, color, pinned } = req.body;

    const noteData = {
      userId: req.user._id,
    };

    if (title !== undefined && title !== null && title.trim() !== '') {
      noteData.title = title;
    }
    if (content !== undefined) noteData.content = content;
    if (color !== undefined) noteData.color = color;
    if (pinned !== undefined) noteData.pinned = pinned;

    const note = new Note(noteData);
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create note' });
  }
};

/**
 * PUT /api/vault/notes/:id
 * Update an existing note by ID (verifying user ownership)
 */
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid note ID format' });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to access this note' });
    }

    const { title, content, color, pinned } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;
    if (pinned !== undefined) note.pinned = pinned;

    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update note' });
  }
};

/**
 * DELETE /api/vault/notes/:id
 * Delete a note by ID (verifying user ownership)
 */
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid note ID format' });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this note' });
    }

    await note.deleteOne();

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID format' });
    }
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

/**
 * GET /api/vault/credentials
 * Fetch all credentials for the authenticated user sorted by updatedAt desc
 */
export const getCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(credentials);
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
};

/**
 * POST /api/vault/credentials
 * Create a new stored credential for the authenticated user
 */
export const createCredential = async (req, res) => {
  try {
    const { siteName, siteUrl, username, password, notes } = req.body;

    if (!siteName || !username || !password) {
      return res.status(400).json({ error: 'siteName, username, and password are required' });
    }

    const credential = new Credential({
      userId: req.user._id,
      siteName,
      siteUrl: siteUrl || '',
      username,
      password,
      notes: notes || '',
    });

    await credential.save();

    res.status(201).json(credential);
  } catch (error) {
    console.error('Create credential error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create credential' });
  }
};

/**
 * PUT /api/vault/credentials/:id
 * Update an existing credential by ID (verifying user ownership)
 */
export const updateCredential = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid credential ID format' });
    }

    const credential = await Credential.findById(id);
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    if (credential.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to access this credential' });
    }

    const { siteName, siteUrl, username, password, notes } = req.body;

    if (siteName !== undefined) {
      if (!siteName || siteName.trim() === '') {
        return res.status(400).json({ error: 'siteName cannot be empty' });
      }
      credential.siteName = siteName;
    }
    if (siteUrl !== undefined) credential.siteUrl = siteUrl;
    if (username !== undefined) {
      if (!username || username.trim() === '') {
        return res.status(400).json({ error: 'username cannot be empty' });
      }
      credential.username = username;
    }
    if (password !== undefined) {
      if (!password) {
        return res.status(400).json({ error: 'password cannot be empty' });
      }
      credential.password = password;
    }
    if (notes !== undefined) credential.notes = notes;

    await credential.save();

    res.json(credential);
  } catch (error) {
    console.error('Update credential error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid credential ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update credential' });
  }
};

/**
 * DELETE /api/vault/credentials/:id
 * Delete a credential by ID (verifying user ownership)
 */
export const deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid credential ID format' });
    }

    const credential = await Credential.findById(id);
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    if (credential.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this credential' });
    }

    await credential.deleteOne();

    res.json({ success: true, message: 'Credential deleted successfully' });
  } catch (error) {
    console.error('Delete credential error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid credential ID format' });
    }
    res.status(500).json({ error: 'Failed to delete credential' });
  }
};
