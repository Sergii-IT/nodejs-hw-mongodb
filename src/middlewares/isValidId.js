import mongoose from 'mongoose';
import httpErrors from 'http-errors';
const { BadRequest } = httpErrors;

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(BadRequest(`${contactId} is not a valid id`));
  }

  next();
};