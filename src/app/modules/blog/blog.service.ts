import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';
import unlinkFile from '../../../shared/unlinkFile';

const createBlog = async (payload: IBlog) => {
  const isExist = await Blog.exists({ title: payload.title });

  if (isExist) {
    payload.image && unlinkFile(payload.image);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog already exists');
  }

  return await Blog.create(payload);
};

const updateBlog = async (id: string, payload: Partial<IBlog>) => {
  const isExist = await Blog.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog not found');
  }

  if (payload.image && isExist.image) {
    unlinkFile(isExist.image as string);
  }

  return await Blog.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
};

const getAllBlogs = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
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
  const result = await Blog.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean<IBlog[]>();

  const total = await Blog.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
};

const deleteBlog = async (id: string) => {
  const isExist = await Blog.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog not found');
  }
  if (isExist.image) {
    unlinkFile(isExist.image as string);
  }
  await Blog.findByIdAndDelete(id);
};

export const BlogService = {
  createBlog,
  updateBlog,
  getAllBlogs,
  deleteBlog,
};
