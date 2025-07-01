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

router.get(
  '/get-all-manual-booking',
  auth(USER_ROLES.ADMIN),
  ManualBookingController.getAllBookings
);

export const ManualBookingRouter = router;
