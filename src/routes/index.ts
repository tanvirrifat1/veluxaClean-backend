import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/Notification/Notification.route';
import { BlogRouter } from '../app/modules/blog/blog.route';
import { FaqRouter } from '../app/modules/faq/faq.route';
import { CleaningServiceRoutes } from '../app/modules/service/service.route';
import { BookingRouter } from '../app/modules/booking/booking.route';
import { ReviewRouter } from '../app/modules/review/review.route';
import { PaymentRoutes } from '../app/modules/payment/payment.route';
import { CleaningContactRouter } from '../app/modules/cleningContact/cleningContact.route';
import { BlogReviewRouter } from '../app/modules/blogReview/blogReview.route';
import { DashboardRouter } from '../app/modules/dashboard/dashboard.route';
import { ManualBookingRouter } from '../app/modules/manualBooking/manualBooking.route';
import { SettingRoutes } from '../app/modules/seeting/seeting.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/blog', route: BlogRouter },
  { path: '/faq', route: FaqRouter },
  { path: '/service', route: CleaningServiceRoutes },
  { path: '/booking', route: BookingRouter },
  { path: '/review', route: ReviewRouter },
  { path: '/payment', route: PaymentRoutes },
  { path: '/contact', route: CleaningContactRouter },
  { path: '/blogReview', route: BlogReviewRouter },
  { path: '/dashboard', route: DashboardRouter },
  { path: '/manual-booking', route: ManualBookingRouter },
  { path: '/setting', route: SettingRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
