import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { CleaningServiceValidation } from './service.validation';
import { CleaningServiceController } from './service.controller';

const router = express.Router();

router.post(
  '/create-service',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = CleaningServiceValidation.serviceSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return CleaningServiceController.createServiceToDB(req, res, next);
  }
);

router.patch(
  '/update-service/:id',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = CleaningServiceValidation.updateServiceSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return CleaningServiceController.updateServiceToDB(req, res, next);
  }
);

export const CleaningServiceRoutes = router;
