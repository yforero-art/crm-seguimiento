"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RESPONSABLE_ANDRES, RESPONSABLE_CAMILA, RESPONSABLE_YESENIA } from "@/lib/mock/responsables";
import type { Rol } from "@/types";

export interface UsuarioActual {
  id: string;
  nombre: string;
  rol: Rol;
}

// TODO(Fase 7): reemplazar por la sesión real de Supabase Auth. Mientras no
// hay login funcionando, esto simula "quién está usando el CRM ahora" — lo
// usan tanto el tablero de Equipo (para saber si mostrar la vista de admin)
// como el Chat (para saber quién envía cada mensaje). Se guarda en
// localStorage por conveniencia del navegador, no es una fuente de verdad.
export const USUARIOS_DISPONIBLES: UsuarioActual[] = [
  { id: RESPONSABLE_YESENIA.id, nombre: RESPONSABLE_YESENIA.nombre, rol: "admin" },
  { id: RESPONSABLE_ANDRES.id, nombre: RESPONSABLE_ANDRES.nombre, rol: "auxiliar" },
  { id: RESPONSABLE_CAMILA.id, nombre: RESPONSABLE_CAMILA.nombre, rol: "auxiliar" },
];

interface UsuarioActualState {
  usuario: UsuarioActual;
  setUsuario: (usuario: UsuarioActual) => void;
}

export const useUsuarioActualStore = create<UsuarioActualState>()(
  persist(
    (set) => ({
      usuario: USUARIOS_DISPONIBLES[0]!,
      setUsuario: (usuario) => set({ usuario }),
    }),
    { name: "crm-usuario-actual" }
  )
);
