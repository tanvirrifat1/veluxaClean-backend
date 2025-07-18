import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

//webhook
router.post(
  '/create-checkout-session',
  auth(USER_ROLES.USER),
  PaymentController.createCheckoutSessionController
);

router.get(
  '/get-all-payment',
  auth(USER_ROLES.ADMIN),
  PaymentController.getAllPayment
);

export const PaymentRoutes = router;
