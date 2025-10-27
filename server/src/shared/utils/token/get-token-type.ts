// ============================
// Generate Token Hash
// ============================
const getTokenType = (token: string): 'api' | 'session' | 'unknown' => {
    if (token.startsWith('sess_')) {
        return 'session';
    } else if (token.startsWith('api_')) {
        return 'api';
    } else {
        return 'unknown';
    }
};

export default getTokenType;
