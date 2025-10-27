import { Types } from 'mongoose';
import UserModel, { IUserDocument } from '@/models/user.model';
import SessionModel from '@/models/session.model';
import { hashPassword } from '@/shared/utils/password';
import * as UserDTOs from './user.dto';

// Пагинация + поиск по name/email
export const fetchUsers = async (opts: UserDTOs.FetchUsersDTO) => {
  const { search, page, limit } = opts;

  const searchRx = search?.trim() ? new RegExp(search.trim(), 'i') : null;
  const and: any[] = [{ archived: { $ne: true } }];
  if (searchRx) and.push({ $or: [{ name: searchRx }, { email: searchRx }] });

  const pipeline: any[] = [];
  if (and.length) pipeline.push({ $match: { $and: and } });

  pipeline.push(
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        results: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    }
  );

  const agg = await UserModel.aggregate(pipeline);
  const facet = agg[0] || { results: [], total: [] };
  const users = facet.results as IUserDocument[];
  const total = facet.total[0]?.count ?? 0;

  return {
    users,
    total,
    pagination: { page, limit, pages: Math.ceil(total / limit) || 1, total },
  };
};

export const getUserById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return UserModel.findById(id).lean();
};

/** ---------- ЕДИНАЯ UPSERT-ФУНКЦИЯ ПО ID ---------- */
type UpsertUserInput = Partial<{
  name: string;
  email: string;
  password: string;
  archived: boolean;
}>;

/**
 * Всегда upsert по _id.
 * - Если id валиден — обновит или вставит с этим _id.
 * - Если id не передан/невалиден — сгенерирует новый _id (create).
 */
export const upsertUser = async (
  id: string | Types.ObjectId | undefined,
  data: UpsertUserInput
): Promise<IUserDocument> => {
  const _id =
    id && Types.ObjectId.isValid(String(id))
      ? new Types.ObjectId(String(id))
      : new Types.ObjectId();

  const update: Record<string, any> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email.toLowerCase();
  if (data.archived !== undefined) update.archived = data.archived;

  if (data.password) {
    update.password = await hashPassword(data.password);
  }

  const doc = await UserModel.findOneAndUpdate(
    { _id },
    { $set: update }, // НЕ трогаем createdAt/updatedAt — timestamps сделает сам
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      // timestamps включены схемой
    }
  );

  return doc!;
};
/** ----------------------------------------------- */

export const archiveUser = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return false;

  const updated = await UserModel.findByIdAndUpdate(
    id,
    { $set: { archived: true } },
    { new: true, runValidators: true }
  );

  if (!updated) return false;

  await SessionModel.deleteMany({ userId: updated._id });
  return true;
};

export const changePassword = async (userId: string, newPassword: string, _oldPassword: string) => {
  if (!Types.ObjectId.isValid(userId)) return false;

  const user = await UserModel.findById(userId).select('+password');
  if (!user) return false;

  user.password = await hashPassword(newPassword);
  await user.save();

  const latest = await SessionModel.findOne({ userId: user._id })
    .sort({ updatedAt: -1 })
    .select('_id')
    .lean();

  if (latest?._id) {
    await SessionModel.deleteMany({ userId: user._id, _id: { $ne: latest._id } });
  }

  return true;
};

export const changePasswordAsRoot = async (userId: string, newPassword: string, options?: { keepLatestSession?: boolean }) => {
  if (!Types.ObjectId.isValid(userId)) return false;
  const user = await UserModel.findById(userId).select('+password');
  if (!user) return false;

  user.password = await hashPassword(newPassword);
  await user.save();

  if (options?.keepLatestSession) {
    const latest = await SessionModel.findOne({ userId: user._id }).sort({ updatedAt: -1 }).select('_id').lean();
    if (latest?._id) {
      await SessionModel.deleteMany({ userId: user._id, _id: { $ne: latest._id } });
    }
  } else {
    await SessionModel.deleteMany({ userId: user._id });
  }

  return true;
};

// Специальный сценарий: первичное создание ROOT
export const initRootUser = async (payload: { name: string; email: string; password: string }) => {
  const ROOT_EMAIL = (process.env.ROOT_EMAIL || '').toLowerCase();

  // Запретим создавать root, если уже есть любой пользователь И задан ROOT_EMAIL
  const total = await UserModel.countDocuments({});
  if (total > 0 && ROOT_EMAIL) {
    return { ok: false as const, reason: 'ROOT already initialized' };
  }

  if (ROOT_EMAIL && payload.email.toLowerCase() !== ROOT_EMAIL) {
    return { ok: false as const, reason: 'Email must match ROOT_EMAIL' };
  }

  // создадим с новым _id (или можешь сгенерить детерминированный)
  const doc = await upsertUser(undefined, payload);
  return { ok: true as const, user: doc };
};