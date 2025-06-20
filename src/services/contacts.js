import { Contact } from '../db/models/contactModel.js'; // Імпортуємо модель

// Отримати всі контакти з пагінацією та сортуванням
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
}) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const totalItems = await Contact.countDocuments();
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find()
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

// Отримати один контакт за _id
export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

// Створити новий контакт
export const createContact = async (data) => {
  return Contact.create(data);
};

// Оновити контакт за _id
export const patchContactById = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, {
    new: true, // повертає оновлений обʼєкт
    runValidators: true, // перевіряє типи/схему
  });
};

// Видалити контакт за _id
export const deleteContactById = async (id) => {
  return Contact.findByIdAndDelete(id);
};
