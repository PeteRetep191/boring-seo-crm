import { SESSION_ID_KEY } from '@/shared/constants/storage-keys';

// ===========================
// Clear Auth Function
// ===========================
const clearAuth = () => {
    if(typeof window !== 'undefined') {
        localStorage.removeItem(SESSION_ID_KEY);
    }
}

export default clearAuth;
