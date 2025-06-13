import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();
  const PORT = Number(getEnvVar('PORT', '3000'));

  app.use(express.json());
  app.use(cors());
  app.use(pinoHttp());

  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  app.use('/contacts', contactsRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
