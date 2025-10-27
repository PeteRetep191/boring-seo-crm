import { Types } from 'mongoose';

// ============================
// Main Exported Function
// ============================
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFiltersMatch = (filters?: QueryFilter[]): Record<string, any> | null => {
  if (!filters?.length) return null;

  const andClauses = filters
    .map(buildFilterClause)
    // убираем пустые объекты, чтобы не было $and: [{}]
    .filter((c) => c && Object.keys(c).length > 0);

  if (!andClauses.length) return null;
  return { $and: andClauses };
};

export default buildFiltersMatch;

// ============================
// Helpers
// ============================

// читаем и value, и values (из URL может прийти одно из них)
const readVal = (f: any) => f?.value ?? f?.values;

const normalizeIds = (arr: unknown[]) =>
  arr.map((v) => (Types.ObjectId.isValid(String(v)) ? new Types.ObjectId(String(v)) : v));

const buildFilterClause = (f: QueryFilter): Record<string, any> => {
  const { key, operator } = f as any;
  const raw = readVal(f as any);

  // защитимся от пустых значений
  const isEmptyArray = Array.isArray(raw) && raw.length === 0;
  const isNil = raw === undefined || raw === null || raw === '';
  if (!key || !operator || isNil || isEmptyArray) return {};

  switch (operator) {
    case 'eq':
      return { [key]: { $eq: raw } };
    case 'ne':
      return { [key]: { $ne: raw } };
    case 'gt':
      return { [key]: { $gt: raw } };
    case 'gte':
      return { [key]: { $gte: raw } };
    case 'lt':
      return { [key]: { $lt: raw } };
    case 'lte':
      return { [key]: { $lte: raw } };
    case 'in': {
      const arr = Array.isArray(raw) ? raw : [raw];
      return { [key]: { $in: normalizeIds(arr) } };
    }
    case 'nin': {
      const arr = Array.isArray(raw) ? raw : [raw];
      return { [key]: { $nin: normalizeIds(arr) } };
    }
    case 'like': {
      const rx = new RegExp(escapeRegex(String(raw)), 'i');
      return { [key]: { $regex: rx } };
    }
    default:
      return {};
  }
};

// ============================
// Types
// ============================
type QueryFilter = {
  key: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like';
  value?: string | number | string[] | number[];
  values?: string[] | number[];
};