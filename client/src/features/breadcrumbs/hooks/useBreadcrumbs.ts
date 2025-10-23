import React, { useEffect} from "react"
import { useImmer } from "use-immer";
import { useLocation } from "react-router-dom";
// Types
import type { BreadcrumbItem, RouteLabelMap } from "@/features/breadcrumbs/types";
// Libs
import { buildBreadcrumbs } from "@/features/breadcrumbs/lib";

// ===========================
// Constants
// ===========================
const INITIAL_STATE: BreadcrumbsState = {
  items: [],
  isReady: false,
};

const DEFAULT_LABEL_MAP: RouteLabelMap = {
  "/": "Home",
  offers: "Offers",
  sites: "Sites",
  category: "Category",
  product: "Product",
  crm: "CRM",
};

// ===========================
// useBreadcrumbs
// ===========================
export const useBreadcrumbs = (
  initialMap: RouteLabelMap = DEFAULT_LABEL_MAP
): BreadcrumbsApi => {
    const location = useLocation();
    const [state, update] = useImmer<BreadcrumbsState>(INITIAL_STATE);
    
    let currentMap = initialMap;

    // --------------------------
    // Actions
    // --------------------------
    const rebuild = (customMap?: RouteLabelMap) => {
    const map = customMap ?? currentMap;
    const items = buildBreadcrumbs(location.pathname, map);
        update((d) => {
        d.items = items;
        d.isReady = true;
        });
    };

    const setMap = (map: RouteLabelMap) => {
        currentMap = map;
        rebuild(map);
    };

    // --------------------------
    // Effects
    // --------------------------
    useEffect(() => {
        rebuild();
    }, [location.pathname]);

    // --------------------------
    // Return
    // --------------------------
    return {
        state,
        actions: {
            rebuild,
            update,
            setMap,
        },
    };
}

export default useBreadcrumbs;

// ========================
// Types
// ========================
export type BreadcrumbsState = {
  items: BreadcrumbItem[];
  isReady: boolean;
};

export type BreadcrumbsApi = {
  state: BreadcrumbsState;
  actions: {
    rebuild: (customMap?: RouteLabelMap) => void;
    update: (updater: (draft: BreadcrumbsState) => void) => void;
    setMap: (map: RouteLabelMap) => void;
  };
};