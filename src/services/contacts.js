import { Contact } from '../db/models/contactModel.js';

// Отримати всі контакти користувача з пагінацією та сортуванням
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const filter = { userId };

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

// Отримати один контакт за _id + userId
export const getContactById = async (id, userId) => {
  return Contact.findOne({ _id: id, userId });
};

// Створити новий контакт
export const createContact = async (data, userId) => {
  return Contact.create({ ...data, userId });
};

// Оновити контакт за _id + userId
export const patchContactById = async (id, userId, data) => {
  return Contact.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
    runValidators: true,
  });
};

// Видалити контакт за _id + userId
export const deleteContactById = async (id, userId) => {
  return Contact.findOneAndDelete({ _id: id, userId });
};
