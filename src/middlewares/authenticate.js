import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import Session from '../db/models/Session.js';
import User from '../db/models/User.js';

const JWT_SECRET = getEnvVar('JWT_SECRET');

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(createHttpError(401, 'Missing access token'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Перевірка наявності токена в сесії (захист від використання після logout)
    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      return next(createHttpError(401, 'Access token expired or invalid'));
    }

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch {
    next(createHttpError(401, 'Invalid or expired access token'));
  }
};
