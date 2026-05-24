import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark",
      toggle: () =>
        set((s) => {
          const next = s.theme === "dark" ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", next);
          return { theme: next };
        }),
      setTheme: (t) => {
        document.documentElement.setAttribute("data-theme", t);
        set({ theme: t });
      },
    }),
    {
      name: "chess-theme",
      onRehydrateStorage: () => (state) => {
        if (state) document.documentElement.setAttribute("data-theme", state.theme);
      },
    }
  )
);
