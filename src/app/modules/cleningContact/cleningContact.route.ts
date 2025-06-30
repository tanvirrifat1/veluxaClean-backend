import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createCleaningContact } from './cleningContact.validation';
import { CleaningContactController } from './cleningContact.controller';

const router = express.Router();

router.post(
  '/create-cleaning-contact',
  auth(USER_ROLES.USER),
  validateRequest(createCleaningContact),
  CleaningContactController.createCleaningContact
);

export const CleaningContactRouter = router;
