import { model, Schema } from 'mongoose';
import { IQuestionAndAns } from './questionAndAns.interface';

const questionAnsAnsSchema = new Schema<IQuestionAndAns>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
    createRoom: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const QuestionAndAns = model<IQuestionAndAns>(
  'QuestionAndAns',
  questionAnsAnsSchema
);
