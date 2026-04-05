import express from 'express';
import { addAvailability, removeAvailability, viewAvailability } from '../controllers/availability.controllers.js';
import { verifyAuth } from '../middleware/auth.verifier.js';

const router = express.Router();

router.post('/', verifyAuth, addAvailability);

router.get('/', verifyAuth, viewAvailability);

router.delete('/:aId', verifyAuth, removeAvailability);

export default router;