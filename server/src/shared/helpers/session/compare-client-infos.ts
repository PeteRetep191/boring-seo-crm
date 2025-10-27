// Types
import type { ClientInfo } from '@/shared/helpers/fastify/types';
import type { ISessionDocument, ISession } from '@/models/session.model';

// ============================
// Compare Client Infos
// ============================
export function compareClientInfos(
  session: ISession | ISessionDocument,
  info: ClientInfo,
  mode: CompareMode = 'hardcore'
): boolean {
  const a = fromSession(session);
  const b = fromClientInfo(info);

  switch (mode) {
    case 'light':
      // Только IP
      return a.ip === b.ip;

    case 'medium':
      // IP + «кто он» без версий/модели, нечувствительно к регистру
      return (
        a.ip === b.ip &&
        eqCI(a.userAgent, b.userAgent) &&
        eqCI(a.os, b.os) &&
        eqCI(a.browserName, b.browserName)
      );

    case 'hardcore':
    default:
      // Полное совпадение всех нормализованных полей (чувствительно к регистру)
      return (
        a.ip === b.ip &&
        eq(a.userAgent, b.userAgent) &&
        eq(a.os, b.os) &&
        eq(a.deviceModel, b.deviceModel) &&
        eq(a.deviceVendor, b.deviceVendor) &&
        eq(a.browserName, b.browserName) &&
        eq(a.browserVersion, b.browserVersion)
      );
  }
}

export default compareClientInfos;

// ===========================
// Helpers
// ===========================

const fromSession = (s: ISession): CanonicalClientInfo => ({
  ip: normalizeIp(s.ip),
  userAgent: norm(s.userAgent ?? null),
  os: norm(s.os ?? null),
  deviceModel: norm(s.device?.model ?? null),
  deviceVendor: norm(s.device?.vendor ?? null),
  browserName: norm(s.browser?.name ?? null),
  browserVersion: norm(s.browser?.version ?? null),
});

const fromClientInfo = (c: ClientInfo): CanonicalClientInfo => ({
  ip: normalizeIp(c.ip),
  userAgent: norm(c.userAgent),
  os: norm(c.os),
  deviceModel: norm(c.device?.model ?? null),
  deviceVendor: norm(c.device?.vendor ?? null),
  browserName: norm(c.browser?.name ?? null),
  browserVersion: norm(c.browser?.version ?? null),
});

const normalizeIp = (ip: string) => ip.replace(/^::ffff:/, '').trim();
const norm = (s?: string | null) => {
  if (s == null) return null;
  const t = String(s).trim();
  return t === '' ? null : t;
};
const eq = (a: string | null, b: string | null) => a === b;
const eqCI = (a: string | null, b: string | null) =>
  (a?.toLowerCase() ?? null) === (b?.toLowerCase() ?? null);

// ===========================
// Types
// ===========================
type CanonicalClientInfo = {
  ip: string;
  userAgent: string | null;
  os: string | null;
  deviceModel: string | null;
  deviceVendor: string | null;
  browserName: string | null;
  browserVersion: string | null;
};

export type CompareMode = 'light' | 'medium' | 'hardcore';