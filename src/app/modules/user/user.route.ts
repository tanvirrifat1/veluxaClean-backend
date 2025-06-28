import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.post('/create-user', UserController.createUser);

router.patch(
  '/update-profile',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = UserValidation.updateZodSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return UserController.updateProfile(req, res, next);
  }
);

router.get(
  '/user',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  UserController.getUserProfile
);

router.get('/get-all-users', auth(USER_ROLES.ADMIN), UserController.getAllUser);

router.get(
  '/get-all-users/:id',
  auth(USER_ROLES.ADMIN),
  UserController.getSingleUser
);

router.get(
  '/profile',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  UserController.getUserProfile
);

export const UserRoutes = router;
