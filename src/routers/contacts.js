import express from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleCreateContact,
  handlePatchContactById,
  handleDeleteContactById,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(handleGetAllContacts));
router.get('/:contactId', ctrlWrapper(handleGetContactById));
router.post('/', ctrlWrapper(handleCreateContact));
router.patch('/:contactId', ctrlWrapper(handlePatchContactById));
router.delete('/:contactId', ctrlWrapper(handleDeleteContactById));
export default router;