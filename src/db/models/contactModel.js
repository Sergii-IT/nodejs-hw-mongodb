import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
   {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: /^\+\d{12}$/, // Наприклад: +380000000002
    },
    email: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`,
      },
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['personal','home','work'],
      default: 'personal',
    },
  },
  {
    timestamps: true, // створює поля createdAt та updatedAt
  }
);

export const Contact = model('contacts', contactsSchema);