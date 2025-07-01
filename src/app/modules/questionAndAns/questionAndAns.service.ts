import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

import { Room } from '../chatRoom/chatRoom.model';

import openai from '../../../shared/openAi';
import { IQuestionAndAns } from './questionAndAns.interface';
import { QuestionAndAns } from './questionAndAns.model';

const createChat = async (payload: IQuestionAndAns) => {
  let room;

  if (payload.roomId) {
    room = await Room.findById(payload.roomId);
    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
    }
  }

  if (!room || payload.createRoom === true) {
    room = await Room.create({
      user: payload.user,
      roomName: payload.question,
    });
  }

  const previousQA = await QuestionAndAns.find({ roomId: room._id }).sort({
    createdAt: 1,
  });

  const historyMessages = previousQA.flatMap((item: any) => [
    { role: 'user', content: item.question },
    { role: 'assistant', content: item.answer || '' },
  ]);

  // System prompt strictly limiting to mental health domain
  const messages: any = [
    {
      role: 'system',
      content:
        `You are a helpful AI assistant specialized in cleaning services. ` +
        `Answer all user questions strictly in the context of cleaning services, ` +
        `home maintenance, cleaning techniques, products, and related advice. ` +
        `Do not provide answers outside the cleaning service domain.`,
    },
    ...historyMessages,
    { role: 'user', content: payload.question },
  ];

  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
  });

  const answer = result.choices[0].message?.content;

  const value = {
    question: payload.question,
    answer: answer,
    roomId: room._id,
    user: payload.user,
    createRoom: payload.createRoom,
  };

  const res = await QuestionAndAns.create(value);

  return res;
};

const getQuestionAndAns = async (
  query: Record<string, unknown>,
  roomId: string
) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  anyConditions.push({ roomId });

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await QuestionAndAns.find(whereConditions)
    .populate({
      path: 'roomId',
      select: 'roomName',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await QuestionAndAns.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const QuestionAndAnsService = {
  createChat,
  getQuestionAndAns,
};
