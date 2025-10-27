import { useLayoutEffect } from "react";
import { useImmer } from "use-immer";
// Constants
import { THEME_STORAGE_KEY } from "@/shared/constants/storage-keys";

// ======= Единственный флаг =======
const FORCE_THEME: ThemeMode | null = null; // "light" | "dark" | null

// =========================
// useTheme
// =========================
const useTheme = (): ThemeApi => {
  const [state, update] = useImmer<ThemeState>(() => ({ mode: getInitialMode() }));

  // -----------------------------
  // Actions
  // -----------------------------
  const setTheme = (mode: ThemeMode) => {
    // при принудительной теме игнорируем внешние попытки смены
    if (FORCE_THEME) {
      update((d) => { d.mode = FORCE_THEME; });
      applyTheme(FORCE_THEME);
      return;
    }

    update((draft) => {
      draft.mode = mode;
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
      applyTheme(mode);
    }
  };

  const resetTheme = () => {
    if (FORCE_THEME) {
      update((d) => { d.mode = FORCE_THEME; });
      applyTheme(FORCE_THEME);
      return;
    }
    setTheme(getInitialMode());
  };

  // -----------------------------
  // Effects
  // -----------------------------
  useLayoutEffect(() => {
    applyTheme(state.mode);
  }, []);

  // -----------------------------
  // Return
  // -----------------------------
  return {
    state,
    actions: { setTheme, resetTheme },
  };
};

export default useTheme;

// ==========================
// Helpers
// ==========================
const applyTheme = (theme: "light" | "dark") => {
  if (typeof document === "undefined") return;
  const root = document.documentElement; // <html>
  const body = document.body;

  root.classList.toggle("dark", theme === "dark");
  body.classList.toggle("dark", theme === "dark");

  root.setAttribute("data-theme", theme);
  body.setAttribute("data-theme", theme);
};

const getSystemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const getInitialMode = (): ThemeMode => {
  // 0) если флаг выставлен — всегда его
  if (FORCE_THEME) return FORCE_THEME;

  // SSR: просто вернём light, storage не трогаем
  if (typeof window === "undefined") return "light";

  // 1) storage
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  // 2) система
  const system = getSystemPrefersDark() ? "dark" : "light";

  // 3) сохранить выбранное
  localStorage.setItem(THEME_STORAGE_KEY, system);
  return system;
};

// ==========================
// Types
// ==========================
export type ThemeMode = "light" | "dark";

export type ThemeState = {
  mode: ThemeMode;
};

export type ThemeApi = {
  state: ThemeState;
  actions: {
    setTheme: (mode: ThemeMode) => void;
    resetTheme: () => void;
  };
};