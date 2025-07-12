import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

// Swagger UI
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL('../docs/swagger.json', import.meta.url), 'utf-8'),
);

export const setupServer = () => {
  const app = express();
  const PORT = Number(getEnvVar('PORT', '3000'));

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.use(pinoHttp());
  app.use(cookieParser());

  // Health check
  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  // API routes
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // Swagger API docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  // Server start
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(
      `📘 Swagger docs available at http://localhost:${PORT}/api-docs`,
    );
  });
};
