import { createContext, useContext, ReactNode } from 'react';
// Hooks
import { useSettingsMenu, type SettingsMenuHookApi } from '@/hooks/contexts/pages/settings/useSettingsMenu';

// ===============================
// Global Context
// ===============================
const SettingsPageContext = createContext<GlobalContextType | undefined>(undefined);

export const SettingsPageProvider = ({ children }: { children: ReactNode }) => {
  const settingsMenu = useSettingsMenu();

  return (
    <SettingsPageContext.Provider value={{
        settingsMenu,

        constants: {
            SERVICE_NAME: 'Xerion CRM'
        }
    }}>
      {children}
    </SettingsPageContext.Provider>
  );
};

export const useSettingPageContext = () => {
  const context = useContext(SettingsPageContext);
  if (!context) throw new Error('useSettingPageContext must be used within SettingsPageProvider');
  return context;
};

// ===============================
// Types
// ===============================
export type GlobalContextType = {
    settingsMenu: SettingsMenuHookApi;

    constants: {
        SERVICE_NAME: string;
    };
}