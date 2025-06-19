import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContactById,
  deleteContactById,
} from '../services/contacts.js';

// GET /contacts?page=1&perPage=10
export const handleGetAllContacts = async (req, res) => {
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;

  const result = await getAllContacts({
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

// GET /contacts/:contactId
export const handleGetContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// POST /contacts
export const handleCreateContact = async (req, res) => {
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields: name, phoneNumber, or contactType');
  }

  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH /contacts/:contactId
export const handlePatchContactById = async (req, res) => {
  const { contactId } = req.params;
  const updatedData = req.body;

  const updatedContact = await patchContactById(contactId, updatedData);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

// DELETE /contacts/:contactId
export const handleDeleteContactById = async (req, res) => {
  const { contactId } = req.params;

  const deleted = await deleteContactById(contactId);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send(); // No content
};