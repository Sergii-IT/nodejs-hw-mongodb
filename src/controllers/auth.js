import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
} from '../services/auth.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const JWT_SECRET = getEnvVar('JWT_SECRET');
console.log('JWT_SECRET:', JWT_SECRET);

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw createHttpError(400, 'Missing required fields');
  }

  const user = await register({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

export const loginUser = async (req, res, next) => {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error); // передає помилку до централізованого error handler-а
  }
};

export const refreshSession = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'Missing refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = await refresh(
    refreshToken,
  );

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(400, 'Missing refresh token');
  }

  await logout(refreshToken);
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const handleSendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw createHttpError(400, 'Missing email field');

    console.log(`[send-reset-email] sending to ${email}`);

    await sendResetEmail(email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });

  } catch (err) {
    console.error('[send-reset-email] ERROR:', err);

    next(createHttpError(500, 'Failed to send email, server error'));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    console.log('[reset-pwd] received:', token ? 'token' : 'no-token');

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      console.error('[reset-pwd] JWT ERROR:', jwtErr);
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) throw createHttpError(404, 'User not found!');

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await Session.deleteMany({ userId: user._id });
    res.status(200).json({ status: 200, message: 'Password has been successfully reset.', data: {} });
  } catch (err) {
    console.error('[reset-pwd] ERROR:', err);
    next(err);
  }
};