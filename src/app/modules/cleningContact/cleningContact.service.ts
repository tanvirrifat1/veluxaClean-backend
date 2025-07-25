import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ICleaningContact } from './cleningContact.interface';
import { CleaningContact } from './cleningContact.model';
import { sendEmail } from '../../../helpers/sendMail';

const createCleaningContact = async (payload: ICleaningContact) => {
  const isUser = await User.findById(payload.user);
  const value = {
    ...payload,
    phone: isUser?.phone,
  };

  return await CleaningContact.create(value);
};

// const getAllCleaningContact = async (query: Record<string, unknown>) => {
//   const { page, limit } = query;

//   const pages = parseInt(page as string) || 1;
//   const size = parseInt(limit as string) || 10;
//   const skip = (pages - 1) * size;

//   const result = await CleaningContact.find()
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(size)
//     .lean();
//   const total = await CleaningContact.countDocuments();
//   const data: any = {
//     result,
//     meta: {
//       page: pages,
//       limit: size,
//       total,
//     },
//   };
//   return data;
// };

const getAllCleaningContact = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, status, ...filterData } = query;
  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  if (status) {
    anyConditions.push({ status: { $regex: status, $options: 'i' } });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await CleaningContact.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await CleaningContact.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const cleaningStatus = async (
  id: string,
  payload: Partial<ICleaningContact>
) => {
  const isExist = await CleaningContact.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Contact not found');
  }

  const result = await CleaningContact.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true }
  ).lean();

  if (result?.status === 'Rejected') {
    sendEmail(
      result?.email,
      'Your cleaning request has been rejected',
      `Hi ${result?.name},<br>
      <br>
      We regret to inform you that your cleaning request has been rejected.
      <br>
      <br>
      Please reach out to us if you have any further questions or concerns.
      <br>
      <br>
      Thank you for your understanding.
      <br>
      <br>
      Best regards,
      <br>
      Cleaning Service Team
      `
    );
  }
};

const deleteCleaningContact = async (id: string) => {
  const isExist = await CleaningContact.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Contact not found');
  }
  return await CleaningContact.findByIdAndDelete(id);
};

export const CleaningContactService = {
  createCleaningContact,
  getAllCleaningContact,
  cleaningStatus,
  deleteCleaningContact,
};
