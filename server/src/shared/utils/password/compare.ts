import bcrypt from 'bcrypt';

// ==========================
// Compare Password
// ==========================
const compare = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export default compare;