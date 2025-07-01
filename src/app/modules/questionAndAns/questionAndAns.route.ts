import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { QuestionAndAnsController } from './questionAndAns.controller';

const router = express.Router();

router.post(
  '/create-chat',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  QuestionAndAnsController.createChat
);

router.get(
  '/get-chat/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  QuestionAndAnsController.getQuestionAndAns
);

export const QuestionAndAnsRoutes = router;
