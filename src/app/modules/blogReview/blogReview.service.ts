import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Blog } from '../blog/blog.model';
import { IBlogReview } from './blogReview.interface';
import { BlogReview } from './blogReview.model';

const createReviewFormDb = async (data: IBlogReview) => {
  const isExistBlog = await Blog.findById(data.blog);
  if (!isExistBlog) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog not found');
  }
  return await BlogReview.create(data);
};

export const BlogReviewService = {
  createReviewFormDb,
};
