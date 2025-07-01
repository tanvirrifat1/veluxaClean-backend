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

const getAllReview = async (id: string, query: Record<string, unknown>) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await BlogReview.find({ blog: id })
    .populate('user', 'name email createdAt image -_id')
    .sort('-createdAt')
    .skip(skip)
    .limit(size)
    .lean();
  const total = await BlogReview.countDocuments({ blog: id });
  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

export const BlogReviewService = {
  createReviewFormDb,
  getAllReview,
};
