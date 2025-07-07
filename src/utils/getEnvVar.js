import dotenv from 'dotenv';

dotenv.config();

/**
 * Отримує значення змінної середовища.
 * @param {string} name - Назва змінної середовища.
 * @param {string} [defaultValue] - Значення за замовчуванням (опційне).
 * @returns {string} - Значення змінної або defaultValue.
 * @throws {Error} - Якщо змінна відсутня і не задано значення за замовчуванням.
 */
export function getEnvVar(name, defaultValue) {
  const value = process.env[name];

  if (value !== undefined && value !== '') {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Missing environment variable: '${name}'`);
}

