import bcrypt from 'bcrypt';

export default class PasswordUtils {
    static async hash(password: string, saltRounds = 10): Promise<string> {
        return bcrypt.hash(password, saltRounds);
    }

    static async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    static generate(length = 12): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }

    static validate(password: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (password.length < 8) errors.push('Password must be at least 8 characters');
        if (password.length > 128) errors.push('Password must be less than 128 characters');
        if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
        if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
        if (!/\d/.test(password)) errors.push('Password must contain number');
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('Password must contain special character');
        if (/\s/.test(password)) errors.push('Password cannot contain spaces');

        return { isValid: errors.length === 0, errors };
    }
}