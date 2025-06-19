import { Contact } from '../db/models/contactModel.js';

// Отримати всі контакти з пагінацією і сортуванням
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
}) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const sortOption = {};
  if (sortBy) {
    sortOption[sortBy] = sortDirection;
  }

  const totalItems = await Contact.countDocuments();
  const contacts = await Contact.find()
    .sort(sortOption)
    .skip(skip)
    .limit(perPage);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
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

