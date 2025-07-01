import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { DashboardController } from './dashboard.controller';

const router = Router();

router.get(
  '/get-statics',
  auth(USER_ROLES.ADMIN),
  DashboardController.getStatics
);

router.get(
  '/get-earning-chart-data',
  auth(USER_ROLES.ADMIN),
  DashboardController.getEarningChartData
);

export const DashboardRouter = router;
