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

export const BlogService = {
  createBlog,
  updateBlog,
};
