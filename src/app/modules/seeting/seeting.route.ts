import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { SettingController } from './seeting.controller';

const router = express.Router();

router.get(
  '/get/:type',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  SettingController.getFromDb
);

router.patch(
  '/update/:type',
  auth(USER_ROLES.ADMIN),
  SettingController.updateFromDb
);

export const SettingRoutes = router;
