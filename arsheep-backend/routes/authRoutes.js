import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Ruta para el login
router.post('/login', login);

export default router;
