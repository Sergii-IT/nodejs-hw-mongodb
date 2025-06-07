import express from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
} from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', handleGetAllContacts); // ✅ GET /contacts
router.get('/:contactId', handleGetContactById); // ✅ GET /contacts/:contactId


export default router;
