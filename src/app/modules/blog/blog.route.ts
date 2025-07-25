import express, { Request, Response, NextFunction } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { BlogValidation } from './blog.validation';
import { BlogController } from './blog.controller';

const router = express.Router();

router.post(
  '/create-blog',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = BlogValidation.createBlogZodSchema.parse(
      JSON.parse(req.body.data)
    );
    return BlogController.createBlog(req, res, next);
  }
);

router.put(
  '/update-blog/:id',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = BlogValidation.updateBlogZodSchema.parse(
      JSON.parse(req.body.data)
    );
    return BlogController.updateBlog(req, res, next);
  }
);

// router.put(
//   '/update-blog/:id',
//   auth(USER_ROLES.ADMIN),
//   fileUploadHandler,
//   (req: Request, res: Response, next: NextFunction) => {
//     const { imagesToDelete, data } = req.body;

//     if (!data && imagesToDelete) {
//       req.body = { imagesToDelete };
//       return BlogController.updateBlog(req, res, next);
//     }

//     if (data) {
//       const parsedData = BlogValidation.updateBlogZodSchema.parse(
//         JSON.parse(data)
//       );

//       req.body = { ...parsedData, imagesToDelete };
//     }

//     return BlogController.updateBlog(req, res, next);
//   }
// );

router.get('/all-blogs', BlogController.getAllBlogs);

router.delete(
  '/delete-blog/:id',
  auth(USER_ROLES.ADMIN),
  BlogController.deleteBlog
);

router.get('/get-details/:id', BlogController.getDetails);

export const BlogRouter = router;
