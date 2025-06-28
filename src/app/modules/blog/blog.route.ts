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

export const BlogRouter = router;
