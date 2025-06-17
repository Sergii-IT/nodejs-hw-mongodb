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

  };


export const createContact = async (data) => {
  return Contact.create(data);
};

export const patchContactById = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, {
    new: true, // повертає оновлений обʼєкт
    runValidators: true, // перевіряє типи/схему
  });

};

export const deleteContactById = async (id) => {
  return Contact.findByIdAndDelete(id);
};
=======
  };
  
export const deleteContactById = async (id) => {
  return Contact.findByIdAndDelete(id);
};

