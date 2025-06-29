import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BlogService } from './blog.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';
import { IBlog } from './blog.interface';

const createBlog = catchAsync(async (req, res) => {
  const value = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image;
  }

  const result = await BlogService.createBlog(value);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog Created Successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const value = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image;
  }

  const result = await BlogService.updateBlog(req.params.id, value);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog Created Successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await BlogService.getAllBlogs(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const result = await BlogService.deleteBlog(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

const getDetails = catchAsync(async (req, res) => {
  const result = await BlogService.getDetails(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

export const BlogController = {
  createBlog,
  updateBlog,
  getAllBlogs,
  deleteBlog,
  getDetails,
};
