import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BlogReviewController } from './blogReview.controller';

const router = Router();

router.post(
  '/create-review',
  auth(USER_ROLES.USER),
  BlogReviewController.createReviewFormDb
);

router.get(
  '/get-all-review/:id',
  auth(USER_ROLES.USER),
  BlogReviewController.getAllReview
);

export const BlogReviewRouter = router;
