import { IManualBooking } from './manualBooking.interface';
import { ManualBooking } from './manualBooking.model';

const createManualBooking = async (payload: IManualBooking) => {
  return await ManualBooking.create(payload);
};

export const ManualBookingService = {
  createManualBooking,
};
