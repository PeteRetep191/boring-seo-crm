import { SESSION_ID_KEY } from '@/shared/constants/storage-keys';

// ============================
// Get Session ID Function
// ============================
const getSessionId = (): string | null => {
    if( typeof window === 'undefined' ) {
        return null;
    }
    return localStorage.getItem(SESSION_ID_KEY);
}

export default getSessionId;
