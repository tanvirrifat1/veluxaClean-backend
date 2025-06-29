import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IService } from './service.interface';
import { CleaningService } from './service.model';

const createServiceToDB = async (payload: IService) => {
  const isExist = await CleaningService.findOne({
    serviceName: payload.serviceName,
  });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service already exists');
  }
  return await CleaningService.create(payload);
};

export const CleaningServiceService = {
  createServiceToDB,
};
