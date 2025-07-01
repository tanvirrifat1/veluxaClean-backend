import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ManualBookingController } from './manualBooking.controller';

const router = express.Router();

router.post(
  '/create-manual-booking',
  auth(USER_ROLES.ADMIN),
  ManualBookingController.createManualBooking
);

export const ManualBookingRouter = router;
