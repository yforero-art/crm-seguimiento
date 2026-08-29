"use client";

import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  getUser: () => User | null;
}

/**
 * Store minimalista para exponer el perfil del usuario a Client Components
 * (ej. mostrar su nombre en el topbar) sin volver a pedirlo por fetch. La
 * fuente de verdad de la sesión sigue siendo Supabase Auth + requireAuth()
 * en el servidor; este store solo cachea la copia ya autorizada para la UI.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  getUser: () => get().user,
}));
