import express from 'express';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  handleSendResetEmail,
  resetPassword, 
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, emailSchema, resetPasswordSchema } from '../schemas/authSchemas.js';

const router = express.Router();

// POST /auth/register
router.post('/register', validateBody(registerSchema), ctrlWrapper(registerUser));

// POST /auth/login
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));

// POST /auth/refresh
router.post('/refresh', ctrlWrapper(refreshSession));

// POST /auth/logout
router.post('/logout', ctrlWrapper(logoutUser));

// POST /auth/send-reset-email
router.post('/send-reset-email', validateBody(emailSchema), ctrlWrapper(handleSendResetEmail));

// POST /auth/reset-pwd
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPassword));

export default router;
