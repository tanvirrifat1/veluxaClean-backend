import { Router } from 'express';
import { FaqController } from './faq.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { FaqValidation } from './faq.validation';

const router = Router();

router.post(
  '/create-faq',
  auth(USER_ROLES.ADMIN),
  validateRequest(FaqValidation.createFaqZodSchema),
  FaqController.createFaq
);

router.patch(
  '/update-faq/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(FaqValidation.updateFaqZodSchema),
  FaqController.updateFaq
);

router.get(
  '/get-all-faq',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  FaqController.getAllFaq
);

export const FaqRouter = router;
