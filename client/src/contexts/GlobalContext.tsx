import { createContext, useContext, ReactNode } from 'react';
// Hooks
// import { useSidebar, type SidebarHookApi } from '@/hooks/common/useSidebar';

// ===============================
// Global Context
// ===============================
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  // const theme = useTheme();
  // const sidebar = useSidebar();

  return (
    <GlobalContext.Provider value={{
      // theme,
      // sidebar,
      
      constants: {
        SERVICE_NAME: 'Xerion CRM'
      }
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobal must be used within GlobalProvider');
  return context;
};

// ===============================
// Types
// ===============================
export type GlobalContextType = {
  // theme: ThemeHookApi;
  // sidebar: SidebarHookApi;
  
  constants: {
    SERVICE_NAME: string;
  };
}