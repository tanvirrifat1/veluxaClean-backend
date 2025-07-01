import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ISetting } from './seeting.interface';
import { Setting } from './seeting.model';

const updateFromDb = async (type: string, updateData: ISetting) => {
  try {
    const result = await Setting.findOneAndUpdate(
      { type },
      { $set: updateData },
      { upsert: true, new: true }
    );
    return result;
  } catch (error: any) {
    throw new Error(
      `Failed to update or create setting for type ${type}: ${error.message}`
    );
  }
};

const getFromDb = async (type: string) => {
  const isExist = await Setting.findOne({ type });
  if (!isExist) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Setting not found for type ${type}`
    );
  }

  const result = await Setting.find({ type });
  return result;
};

export const SettingService = {
  updateFromDb,
  getFromDb,
};
