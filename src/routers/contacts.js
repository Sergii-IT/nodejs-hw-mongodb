import express from 'express';
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

const router = express.Router();

router.get('/', ctrlWrapper(handleGetAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));

router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(handleCreateContact)
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(handlePatchContactById)
);

router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContactById));

export default router;