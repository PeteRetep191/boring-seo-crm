type InternalUser = {
  _id: string;
  name: string;
  email?: string | null;
  username?: string;
  externalId?: string | null;
};

type ConversionItem = {
  user: InternalUser & { id: string };
  totals: { totalSales: number; totalLeads: number; totalPayout: number };
};

type BrocardUser = {
  id: number;
  uuid: string;
  name: string; // часто у форматі "Name (1001)"
  email?: string;
};

export type BrocardCostRow = {
  group: {
    type: "user";
    entity: { id: number; uuid: string; name: string };
  };
  settled: { amount: string; count: number };
  pending: { amount: string; count: number };
  // інші поля опущено для стислості
};

export type ManualCostByUser = {
  userId: string;              // internal _id
  total: number;
  fee: number;
  totalWithFee: number;        // це вже amount + fee
  count: number;
  // media/technical поля опущено
};

type InputShape = {
  users: InternalUser[];
  brocardUsers: BrocardUser[];
  converions: ConversionItem[];          // список, а не {data:[]}
  brocardCosts: { data: BrocardCostRow[] };
  manualCosts: { byUser: ManualCostByUser[] };
};

type OutputRow = {
  user: {
    id: string;
    name: string;
    username?: string;
    email?: string | null;
    externalId?: string | null;
  };
  totalRevenue: number; // == conversions.totalPayout
  totalProfit: number;  // revenue - (brocardCosts*1.045 + manualCosts.totalWithFee)
  roi: number;          // profit / cost * 100
};

const toNumber = (v: string | number | null | undefined) =>
  typeof v === "number" ? v : v ? parseFloat(String(v)) : 0;

const extractExternalIdFromName = (name?: string) => {
  if (!name) return null;
  const m = name.match(/\((\d+)\)\s*$/);
  return m ? m[1] : null;
};

export function buildBuyersProfitList(input: InputShape): OutputRow[] {
  const { users, brocardUsers, converions, brocardCosts, manualCosts } = input;

//   console.log('input:', input);

  // --- Індекси для швидкого мапінгу
  const byInternalId = new Map(users.map(u => [u._id, u]));
  const byExternalId = new Map(
    users
      .filter(u => !!u.externalId)
      .map(u => [String(u.externalId), u])
  );
  const byEmail = new Map(
    users
      .filter(u => !!u.email)
      .map(u => [String(u.email).toLowerCase(), u])
  );
  const brocardById = new Map(brocardUsers.map(bu => [bu.id, bu]));

  // conversions → revenue по внутрішньому користувачу
  const revenueByInternalId = new Map<string, number>();
for (const c of converions ?? []) {
  // важный момент: у некоторых респонсов _id может отсутствовать
  const internalId = (c.user as any)._id ?? c.user.id;
  if (!internalId) continue;
  revenueByInternalId.set(String(internalId), toNumber(c.totals?.totalPayout));
}

const manualByInternalId = new Map<string, number>();
for (const m of manualCosts?.byUser ?? []) {
  if (!m?.userId) continue;
  manualByInternalId.set(String(m.userId), toNumber(m.totalWithFee));
}

// brocard → агрегируем только то, что удалось смэпить на internalId
const brocardCostByInternalId = new Map<string, number>();
for (const row of brocardCosts?.data ?? []) {
  const entity = row?.group?.entity;
  const settled = toNumber(row?.settled?.amount);
  const pending = toNumber(row?.pending?.amount);
  const base = settled + pending;
  const withBankFee = base * 1.045;

  let matchedInternal: InternalUser | undefined;

  // 1) externalId из имени "Name (1009)"
  const extFromName = extractExternalIdFromName(entity?.name);
  if (extFromName && byExternalId.has(extFromName)) {
    matchedInternal = byExternalId.get(extFromName);
  }

  // 2) email из brocardUsers
  if (!matchedInternal) {
    const bu = brocardById.get(entity?.id!);
    const email = bu?.email?.toLowerCase();
    if (email && byEmail.has(email)) {
      matchedInternal = byEmail.get(email);
    }
  }

  if (!matchedInternal) {
    // не нашли — просто пропускаем эту строку, manual при этом не трогаем
    continue;
  }

  const key = matchedInternal._id;
  brocardCostByInternalId.set(key, toNumber(brocardCostByInternalId.get(key)) + withBankFee);
}

// --- финальный список: идём по тем, у кого есть выручка (conversions)
const result: OutputRow[] = [];
for (const [internalId, revenue] of revenueByInternalId) {
  const u = byInternalId.get(internalId);
  if (!u) continue;

  const manual = toNumber(manualByInternalId.get(internalId));
  const brocard = toNumber(brocardCostByInternalId.get(internalId));

  // если в brocard ничего не нашли — просто 0; manual останется как есть
  const totalCost = manual + brocard;
  const totalProfit = revenue - totalCost;
  const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  // точечный лог для проблемных пользователей
  // if (u.email?.toLowerCase() === 'mrdepman@gmail.com') {
  //   console.log('[DEBUG MrDepman]', {
  //     internalId,
  //     revenue,
  //     manual,
  //     brocard,
  //     totalCost,
  //     totalProfit,
  //     roi
  //   });
  // }

  result.push({
    user: {
      id: u._id,
      name: u.name,
      username: u.username,
      email: u.email ?? null,
      externalId: u.externalId ?? null,
    },
    totalRevenue: revenue,
    totalProfit,
    roi,
  });
}

result.sort((a, b) => b.totalProfit - a.totalProfit);
return result;
}