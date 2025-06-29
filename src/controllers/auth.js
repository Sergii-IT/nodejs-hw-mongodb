import { register, login, refresh, logout } from '../services/auth.js';
import createHttpError from 'http-errors';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw createHttpError(400, 'Missing required fields');
  }

  const user = await register({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, 'Missing email or password');
  }

  const { accessToken, refreshToken } = await login({ email, password });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

export const refreshSession = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'Missing refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = await refresh(refreshToken);

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
