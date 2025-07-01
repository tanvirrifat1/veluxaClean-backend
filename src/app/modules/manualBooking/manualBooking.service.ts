import { IManualBooking } from './manualBooking.interface';
import { ManualBooking } from './manualBooking.model';

const createManualBooking = async (payload: IManualBooking) => {
  return await ManualBooking.create(payload);
};

const getAllBookings = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [{ serviceName: { $regex: searchTerm, $options: 'i' } }],
    });
  }
  // Add filter conditions
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      })
    );
    conditions.push({ $and: filterConditions });
  }

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first
  const result = await ManualBooking.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await ManualBooking.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
};

export const ManualBookingService = {
  createManualBooking,
  getAllBookings,
};
