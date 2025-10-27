// React Query
import { useQuery } from "@tanstack/react-query";
// Context
import { createContext, useContext, ReactNode, useState } from 'react';
// Api
import { getMe } from '@/api/backend/routes/user.api';
// Helpers
import { redirectTo } from "@/shared/helpers/path";

const AuthContext = createContext<{user: any, setUser: React.Dispatch<React.SetStateAction<any>>} | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ user, setUser ] = useState<any>(null);
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: async() => {
      
      // if(typeof window === 'undefined') return null;
      // if(window.location.pathname === '/login') return null;

      try {
        const response = await getMe();
        setUser(response.data.result);

        return response;
      } catch (error) {
        // redirectTo('login');
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 50000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // ---------------------------------
  // Render
  // ---------------------------------
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};