import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { bookingZodSchema } from './booking.validation';
import { BookingController } from './booking.controller';

const router = Router();

router.post(
  '/create-booking',
  auth(USER_ROLES.USER),
  validateRequest(bookingZodSchema),
  BookingController.createBooking
);

router.get(
  '/get-all-booking',
  auth(USER_ROLES.ADMIN),
  BookingController.getAllBookings
);

export const BookingRouter = router;
