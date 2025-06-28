import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { sendNotifications } from '../../../helpers/notificationHelper';
import unlinkFile from '../../../shared/unlinkFile';

const createUserFromDb = async (payload: IUser) => {
  payload.role = USER_ROLES.USER;

  const newUser = await User.create(payload);
  if (!newUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User couldn't be created");
  }

  const otp = generateOTP();
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 30 * 60 * 1000),
  };

  const emailContent = emailTemplate.createAccount({
    name: newUser.name,
    otp,
    email: newUser.email,
  });
  emailHelper.sendEmail(emailContent);

  const updatedUser = await User.findByIdAndUpdate(
    newUser._id,
    { authentication },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Failed to update authentication info'
    );
  }

  if (updatedUser) {
    await sendNotifications({
      text: `Registered successfully, ${updatedUser.name}`,
      type: 'ADMIN',
    });
  }

  return updatedUser;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    ...filterData
  } = query;

  // Search conditions
  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [{ fullName: { $regex: searchTerm, $options: 'i' } }],
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

  conditions.push({ role: USER_ROLES.USER });

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Pagination setup
  const currentPage = Number(page);
  const pageSize = Number(limit);
  const skip = (currentPage - 1) * pageSize;

  // Sorting setup
  const sortOrder = order === 'desc' ? -1 : 1;
  const sortCondition: { [key: string]: SortOrder } = {
    [sortBy as string]: sortOrder,
  };

  // Query the database
  const [users, total] = await Promise.all([
    User.find(whereConditions)
      .sort(sortCondition)
      .skip(skip)
      .limit(pageSize)
      .lean<IUser[]>(), // Assert type
    User.countDocuments(whereConditions),
  ]);

  return {
    data: users,
    meta: {
      total,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
    },
  };
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image as string);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

export const UserService = {
  createUserFromDb,
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsers,
  getSingleUser,
};
