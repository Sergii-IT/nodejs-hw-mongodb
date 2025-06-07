import { Contact } from '../db/models/contactModel.js'; // Імпортуємо модель

// Отримати всі контакти
export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

// Отримати один контакт за _id
export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};