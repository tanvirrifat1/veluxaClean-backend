import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IService } from './service.interface';
import { CleaningService } from './service.model';
import unlinkFile from '../../../shared/unlinkFile';

const createServiceToDB = async (payload: IService) => {
  const isExist = await CleaningService.findOne({
    serviceName: payload.serviceName,
  });
  if (isExist) {
    payload.image && unlinkFile(payload.image);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service already exists');
  }
  return await CleaningService.create(payload);
};

const updateServiceToDB = async (
  id: string,
  payload: IService
): Promise<IService | null> => {
  const isExist: any = await CleaningService.findOne({
    serviceName: payload.serviceName,
    _id: { $ne: id },
  });

  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service already exists');
  }

  if (payload.image && isExist?.image) {
    try {
      await unlinkFile(isExist.image as string);
    } catch (error) {
      console.error('Failed to delete old image:', error);
    }
  }

  const updatedService = await CleaningService.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!updatedService) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found');
  }

  return updatedService;
};

export const CleaningServiceService = {
  createServiceToDB,
  updateServiceToDB,
};
