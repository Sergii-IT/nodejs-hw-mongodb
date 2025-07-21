import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

dotenv.config();

const startApp = async () => {
  try {
    await initMongoConnection(); // Підключення до MongoDB
    setupServer();               // Запуск сервера тільки після з'єднання з MongoDB
  } catch (error) {
    console.error('Failed to start application:', error.message);
    process.exit(1); // Завершити процес з помилкою
  }
};

startApp();
