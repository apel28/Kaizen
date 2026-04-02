import express from 'express';
import { addAvailability, removeAvailability, viewAvailability } from '../controllers/availability.controllers.js';
import { verifyAuth } from '../middleware/auth.verifier.js';

const router = express.Router();

// Add a new availability slot
router.post('/', verifyAuth, addAvailability);

// View availability slots
router.get('/', verifyAuth, viewAvailability);

// Remove an availability slot
router.delete('/:aId', verifyAuth, removeAvailability);

export default router;