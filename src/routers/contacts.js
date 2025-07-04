import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleCreateContact,
  handlePatchContactById,
  handleDeleteContactById,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactSchemas.js';
import { upload } from '../middlewares/upload.js'; // multer для обробки multipart/form-data

const router = express.Router();

// Захист всіх маршрутів
router.use(authenticate);

// Отримати всі контакти
router.get('/', ctrlWrapper(handleGetAllContacts));

// Отримати контакт за ID
router.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));

// Створити контакт з фото (опційно)
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(handleCreateContact)
);

// Оновити контакт з новим фото (опційно)
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(handlePatchContactById)
);

// Видалити контакт
router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContactById));

export default router;