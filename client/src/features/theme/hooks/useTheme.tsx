import { useEffect } from "react";
import { useImmer } from "use-immer";
import { THEME_STORAGE_KEY } from "@/shared/constants/storage-keys";

// ========================
// Helpers
// ========================
const getSystemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

const applyDomTheme = (resolved: "light" | "dark") => {
  const root = document.documentElement;
  const body = document.body;

  if (resolved === "dark") {
    root.classList.add("dark");
    body.classList.add("dark");
  } else {
    root.classList.remove("dark");
    body.classList.remove("dark");
  }
  root.setAttribute("data-theme", resolved);
};

const readInitialMode = (): ThemeMode => {
  if (typeof window === "undefined") return "system";
  const raw = localStorage.getItem(THEME_STORAGE_KEY);
  return (raw === "light" || raw === "dark" || raw === "system") ? (raw as ThemeMode) : "system";
};

const computeResolved = (mode: ThemeMode): "light" | "dark" => {
  if (mode === "system") return getSystemPrefersDark() ? "dark" : "light";
  return mode;
};

// ========================
// Constants
// ========================
const INITIAL_THEME_STATE: ThemeState = {
  mode: readInitialMode(),
  resolved: "dark",
};

// ========================
// Hook
// ========================
const useTheme = (): ThemeApi => {
  const [state, update] = useImmer<ThemeState>(INITIAL_THEME_STATE);

  // Инициализация + первичное применение
  useEffect(() => {
    const mode = readInitialMode();
    const resolved = computeResolved(mode);

    update((draft) => {
      draft.mode = mode;
      draft.resolved = resolved;
    });

    applyDomTheme(resolved);

    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode === "system") {
        const nextResolved = mql.matches ? "dark" : "light";
        update((draft) => {
          draft.resolved = nextResolved;
        });
        applyDomTheme(nextResolved);
      }
    };

    mql.addEventListener?.("change", onChange);
    // для старых браузеров
    mql.addListener?.(onChange);

    return () => {
      mql.removeEventListener?.("change", onChange);
      mql.removeListener?.(onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------
  // Actions
  // --------------------------
  const handleApply = async () => {
    // Синхронизирует storage и DOM с текущим state.mode
    const { mode } = state;

    if (mode === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    }

    const resolved = computeResolved(mode);
    update((draft) => {
      draft.resolved = resolved;
    });
    applyDomTheme(resolved);
  };

  const switchTheme = (nextMode: ThemeMode) => {
    update((draft) => {
      draft.mode = nextMode;
    });
    handleApply();
  }

  const validate = () => {
    const valid = state.mode === "light" || state.mode === "dark" || state.mode === "system";
    if (!valid) {
      console.warn("[useTheme] invalid mode:", state.mode);
    }
  };

  const resetTheme = () => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    const resolved = computeResolved("dark");

    update((draft) => {
      draft.mode = "dark";
      draft.resolved = resolved;
    });
    applyDomTheme(resolved);
  };

  return {
    state,
    actions: {
      switchTheme,
      handleApply,
      update,
      validate,
      resetTheme,
    },
  };
};

export default useTheme;

// ========================
// Types
// ========================
export type ThemeMode = "light" | "dark" | "system";

export type ThemeState = {
  /** выбранный пользователем режим */
  mode: ThemeMode;
  /** фактически применённая тема с учётом system */
  resolved: "light" | "dark";
};

export type ThemeApi = {
  state: ThemeState;
  actions: {
    /** Переключает тему на nextMode и применяет её */
    switchTheme: (nextMode: ThemeMode) => void;
    /** Применяет текущую тему к DOM и localStorage (async для консистентности со структурой) */
    handleApply: () => Promise<void>;
    /** Доступ к useImmer update, чтобы менять state.mode и др. */
    update: (updater: (draft: ThemeState) => void) => void;
    /** Опциональная проверка корректности состояния */
    validate: () => void;
    /** Сброс к system: удаляет ключ из storage и применяет системную тему */
    resetTheme: () => void;
  };
};