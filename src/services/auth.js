import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const JWT_SECRET = getEnvVar('JWT_SECRET');
const ACCESS_EXPIRES_IN = 15 * 60; // 15 хв в секундах
const REFRESH_EXPIRES_IN = 30 * 24 * 60 * 60; // 30 днів в секундах

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, 'Invalid email or password');

  // Створюємо токени
  const payload = { userId: user._id };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

  // Видаляємо стару сесію
  await Session.deleteMany({ userId: user._id });

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + ACCESS_EXPIRES_IN * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + REFRESH_EXPIRES_IN * 1000);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refresh = async (refreshToken) => {
  let payload;

  try {
    payload = jwt.verify(refreshToken, JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const existingSession = await Session.findOne({ refreshToken });

  if (!existingSession) {
    throw createHttpError(401, 'Session not found');
  }

  // Видаляємо стару сесію
  await Session.deleteOne({ _id: existingSession._id });

  // Генеруємо нові токени
  const newPayload = { userId: payload.userId };
  const accessToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  const newRefreshToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + ACCESS_EXPIRES_IN * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + REFRESH_EXPIRES_IN * 1000);

  await Session.create({
    userId: payload.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, newRefreshToken };
};

export const logout = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};