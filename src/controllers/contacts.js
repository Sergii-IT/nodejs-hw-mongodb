import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContactById,
  deleteContactById,
} from '../services/contacts.js';
import { uploadImage } from '../utils/cloudinary.js';

// GET /contacts
export const handleGetAllContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
  } = req.query;
  const userId = req.user._id;

  const result = await getAllContacts({
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder,
    userId,
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
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);
  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// POST /contacts
export const handleCreateContact = async (req, res) => {
  const { name, phoneNumber, contactType } = req.body;
  const userId = req.user._id;

  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      'Missing required fields: name, phoneNumber, or contactType',
    );
  }

  let photoUrl = null;
  if (req.file) {
    try {
      photoUrl = await uploadImage(req.file.buffer);
    } catch (err) {
      console.error('Image upload failed:', err.message);
      throw createError(500, 'Image upload failed');
    }
  }

  const newContact = await createContact(
    { name, phoneNumber, contactType, photo: photoUrl },
    userId,
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH /contacts/:contactId
export const handlePatchContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const updatedData = { ...req.body };

  if (req.file) {
    try {
      updatedData.photo = await uploadImage(req.file.buffer);
    } catch (err) {
      console.error('Image upload failed:', err.message);
      throw createError(500, 'Image upload failed');
    }
  }

  const updatedContact = await patchContactById(contactId, userId, updatedData);
  if (!updatedContact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

// DELETE /contacts/:contactId
export const handleDeleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deleted = await deleteContactById(contactId, userId);
  if (!deleted) throw createError(404, 'Contact not found');

  res.status(204).send();
};