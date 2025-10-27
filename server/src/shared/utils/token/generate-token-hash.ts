// Types
import { ApiTokenHash, SessionTokenHash } from '@/shared/types/token-hash.types';
// Utils
import { randomBytes } from 'crypto';

// ============================
// Generate Token Hash
// ============================
const generateTokenHash = <T extends 'session' | 'api'>(
        type: T
    ): T extends 'session' ? SessionTokenHash : ApiTokenHash => {
    if (type === 'session') {
        const body = randomBytes(18).toString('hex');
        return `sess_${body}` as any;
    } else {
        const body = randomBytes(38).toString('hex');
        return `api_${body}` as any;
    }
};

export default generateTokenHash;

// ============================
// Types
// ============================
export type TokenHash = ApiTokenHash | SessionTokenHash;
