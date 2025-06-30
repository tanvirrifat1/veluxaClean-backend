import { User } from '../user/user.model';
import { ICleaningContact } from './cleningContact.interface';
import { CleaningContact } from './cleningContact.model';

const createCleaningContact = async (payload: ICleaningContact) => {
  const isUser = await User.findById(payload.user);
  console.log(isUser);
  const value = {
    ...payload,
    phone: isUser?.phone,
  };

  return await CleaningContact.create(value);
};

export const CleaningContactService = {
  createCleaningContact,
};
