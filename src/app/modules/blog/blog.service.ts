import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBlog, UpdateBlogPayload } from './blog.interface';
import { Blog } from './blog.model';
import unlinkFile from '../../../shared/unlinkFile';

const createBlog = async (payload: IBlog) => {
  const isExist = await Blog.exists({ title: payload.title });

  if (isExist) {
    if (payload.image && Array.isArray(payload.image)) {
      payload.image.forEach(img => unlinkFile(img));
    } else if (typeof payload.image === 'string') {
      unlinkFile(payload.image);
    }

    throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog already exists');
  }

  return await Blog.create(payload);
};

// const updateBlog = async (id: string, payload: Partial<IBlog>) => {
//   const isExist = await Blog.findById(id);
//   if (!isExist) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog not found');
//   }

//   if (isExist) {
//     if (payload.image && Array.isArray(payload.image)) {
//       payload.image.forEach(img => unlinkFile(img));
//     } else if (typeof payload.image === 'string') {
//       unlinkFile(payload.image);
//     }

//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog already exists');
//   }

//   return await Blog.findOneAndUpdate({ _id: id }, payload, {
//     new: true,
//   });
// };

const updateBlog = async (id: string, payload: UpdateBlogPayload) => {
  const isExistProducts = await Blog.findById(id);

  if (!isExistProducts) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product doesn't exist!");
  }

  if (payload.imagesToDelete && payload.imagesToDelete.length > 0) {
    for (let image of payload.imagesToDelete) {
      unlinkFile(image);
    }

    isExistProducts.image = isExistProducts.image.filter(
      (img: string) => !payload.imagesToDelete!.includes(img)
    );
  }

  const updatedImages = payload.image
    ? [...isExistProducts.image, ...payload.image]
    : isExistProducts.image;

  const updateData = {
    ...payload,
    image: updatedImages,
  };

  const result = await Blog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return result;
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
    if (Array.isArray(isExist.image)) {
      isExist.image.forEach(img => unlinkFile(img));
    } else {
      unlinkFile(isExist.image);
    }
  }

  await Blog.findByIdAndDelete(id);
};

const getDetails = async (id: string) => {
  const result = await Blog.findById(id).lean<IBlog>();
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
  }
  return result;
};

export const BlogService = {
  createBlog,
  updateBlog,
  getAllBlogs,
  deleteBlog,
  getDetails,
};
