// Context
import { createContext, useContext } from "react";
// Hooks
import { useImmer } from "use-immer";
import { useSiteForm } from "../hooks";
import { useNavigate } from "react-router-dom";
// Types
import { SiteFormApi } from "../hooks/useSiteForm";
import { Updater } from "use-immer";
import { Draft } from "immer";

const DetailsSiteFormContext = createContext<DetailsSiteFormContextApi | null>(
  null,
);

// =============================
// Constants
// =============================
const INITIA_TABS_STATE: TabState = {
  activeTab: "main",
  tabs: [
    { id: "main", label: "Main" },
    { id: "placements", label: "Placements" },
    { id: "webhook", label: "Webhook" },
    { id: "settings", label: "Settings" },
  ] as const,
};

const INITIAL_MODALS_STATE: ModalsState = {
  openStates: {
    showcaseDetailsModal: false,
  },
};

// =============================
// DetailsSiteFormProvider
// =============================
export const DetailsSiteFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const [tabState, updateTabState] = useImmer<TabState>(INITIA_TABS_STATE);
  const [modalsState, updateModalsState] =
    useImmer<ModalsState>(INITIAL_MODALS_STATE);
  const siteForm = useSiteForm({
    onClose: () => {
      navigate("/sites");
    },
  });

  // ---------------------------------
  // Render
  // ---------------------------------
  return (
    <DetailsSiteFormContext.Provider
      value={{
        tabState,
        modalsState,
        siteForm,
        actions: {
          updateTabState: (newTab: string) => {
            updateTabState((draft) => {
              draft.activeTab = newTab;
            });
          },
          updateModalsState: (fn) => {
            updateModalsState(fn);
          },
        },
      }}
    >
      {children}
    </DetailsSiteFormContext.Provider>
  );
};

export const useDetailsSiteFormContext = () => {
  const ctx = useContext(DetailsSiteFormContext);
  if (!ctx)
    throw new Error(
      "DetailsSiteFormContext must be used within DetailsSiteFormProvider",
    );
  return ctx;
};

// =============================
// Types
// =============================
export interface DetailsSiteFormContextApi {
  tabState: TabState;
  modalsState: ModalsState;
  siteForm: SiteFormApi;
  actions: {
    updateTabState: (newTab: string) => void;
    updateModalsState: (fn: (draft: Draft<ModalsState>) => void) => void;
  };
}

export type TabState = {
  activeTab: string;
  tabs: Array<{ id: string; label: string }>;
};

export type ModalsState = {
  openStates: {
    showcaseDetailsModal: boolean;
  };
};
