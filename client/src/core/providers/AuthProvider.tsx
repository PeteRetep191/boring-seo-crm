import { createContext, useState } from 'react';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthContextType | null>(null);

    return(
        <AuthContext.Provider value={state}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

// ===========================
// Types
// ===========================
export type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};