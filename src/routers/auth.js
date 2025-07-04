import express from 'express';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  handleSendResetEmail,
  resetPassword, 
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, emailSchema, resetPasswordSchema } from '../schemas/authSchemas.js';

const router = express.Router();

// POST /auth/register
router.post('/register', validateBody(registerSchema), registerUser);

// POST /auth/login
router.post('/login', validateBody(loginSchema), loginUser);

// POST /auth/refresh
router.post('/refresh', refreshSession);

// POST /auth/logout
router.post('/logout', logoutUser);

// POST /auth/send-reset-email
router.post('/send-reset-email', validateBody(emailSchema), handleSendResetEmail);

// POST /auth/reset-pwd
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);

export default router;
