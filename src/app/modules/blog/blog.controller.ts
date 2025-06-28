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
    value.image = image[0];
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
  const { id } = req.params;
  const { body, files } = req;

  const imagePaths = getFilePathMultiple(files, 'image', 'image');

  const payload: Partial<IBlog> = {
    ...body,
    ...(imagePaths?.length && { image: imagePaths[0] }),
  };

  const updatedBlog = await BlogService.updateBlog(id, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog updated successfully',
    data: updatedBlog,
  });
});

export const BlogController = {
  createBlog,
  updateBlog,
};
