import bycrypt from 'bcrypt';

// ==========================
// Compare Password
// ==========================
const hash = async (password: string) => {
    return bycrypt.hash(password, 10);
};

export default hash;