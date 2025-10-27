// ============================
// Get Expire Date Utility
// ============================
const getExpireDate = (rememberMe: boolean): Date => {
    const baseDate = new Date();
    return new Date(baseDate.setDate(baseDate.getDate() + (rememberMe ? 30 : 1)));
};

export default getExpireDate;
