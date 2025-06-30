import { Router } from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewSchema } from './review.validation';
import { ReviewController } from './review.controller';

const router = Router();

router.post(
  '/create-review',
  auth(USER_ROLES.USER),
  validateRequest(ReviewSchema),
  ReviewController.createReview
);

router.get(
  '/get-review/:service',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  ReviewController.getReview
);

export const ReviewRouter = router;
