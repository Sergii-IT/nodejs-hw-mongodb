import express from 'express';
import pinoHttp from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routes/contactsRouter.js';


export const setupServer = () => {
  const app = express();
  const PORT = Number(getEnvVar('PORT', '3000'));
  app.use(express.json());
  app.use(cors());

  app.use(
    pinoHttp()
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });
  app.use('/contacts', contactsRouter); // 🔗 Підключення роута контактів
  // 404 для неіснуючих маршрутів
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Contact not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};