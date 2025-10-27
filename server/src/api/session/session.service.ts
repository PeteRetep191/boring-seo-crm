import SessionModel from '@/models/session.model';
// Types
import { Types } from 'mongoose';
import { ClientInfo } from '@/shared/helpers/fastify/types';
import { SessionTokenHash } from '@/shared/types/token-hash.types';
// Models
import { ISessionDocument } from '@/models/session.model';
import { FastifyRequest } from 'fastify/types/request';
// Helpers
import { getClientInfo } from '@/shared/helpers/fastify';
// Utils
import { generateTokenHash, getExpireDate } from '@/shared/utils/token';

// ---------------------------
// Getters
// ---------------------------
export const getCurrentSession = async (options: {
  userId: string;
  tokenHash: string;
}): Promise<ISessionDocument | null> => {
  const { userId, tokenHash } = options;
  if (!Types.ObjectId.isValid(userId)) {
    return null;
  }
  return SessionModel.findOne({
    userId: new Types.ObjectId(userId),
    tokenHash,
  })
    .populate('userId', 'name username')
    .lean();
};

export const getSessionById = async (id: string): Promise<ISessionDocument | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return SessionModel.findById(id).populate('userId', 'name username').lean();
};

export const getUserSessions = async (userId: string): Promise<ISessionDocument[]> => {
  if (!Types.ObjectId.isValid(userId)) {
    return [];
  }
  return SessionModel.find({
    userId: new Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .populate('userId', 'name username')
    .lean();
};

// ---------------------------
// Deleters
// ---------------------------
export const deleteSessionById = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  const result = await SessionModel.findByIdAndDelete(id);
  return !!result;
};

export const deleteSessionByHash = async (hash: string): Promise<boolean> => {
  if (!hash) {
    return false;
  }
  const result = await SessionModel.findOneAndDelete({ tokenHash: hash });
  return !!result;
};

export const deleteUserSessions = async (userId: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(userId)) {
    return false;
  }
  const result = await SessionModel.deleteMany({ userId: new Types.ObjectId(userId) });
  return (result?.deletedCount ?? 0) > 0;
};

// ---------------------------
// Actions
// ---------------------------
export const createNewSessionByRequest = async (
  request: FastifyRequest,
  rememberMe: boolean
): Promise<ISessionDocument> => {
  const newTokenHash: SessionTokenHash = generateTokenHash('session');
  const clientInfo: ClientInfo = getClientInfo(request);

  const { userId } = request;

  const session = new SessionModel({
    ...clientInfo,
    userId,
    expiresAt: getExpireDate(rememberMe),
    tokenHash: newTokenHash,
  });

  await session.save();
  return session;
};

// ---------------------------------------------
// Опционально: объект по умолчанию для совместимости
// ---------------------------------------------
export default {
  getCurrentSession,
  getSessionById,
  getUserSessions,
  deleteSessionById,
  deleteSessionByHash,
  deleteUserSessions,
  createNewSessionByRequest,
};