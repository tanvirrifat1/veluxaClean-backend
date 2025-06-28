import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';

const createBlog = async (payload: IBlog) => {
  const isExist = await Blog.exists({ title: payload.title });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog already exist');
  }
  const result = await Blog.create(payload);
  return result;
};

export const BlogService = {
  createBlog,
};
