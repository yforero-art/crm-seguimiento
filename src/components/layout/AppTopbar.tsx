"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USUARIOS_DISPONIBLES, useUsuarioActualStore } from "@/store/usuarioActualStore";

const TITULOS_POR_RUTA: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clientes": "Clientes",
  "/pipeline": "Pipeline",
  "/tareas": "Tareas",
  "/calendario": "Calendario",
  "/reportes": "Reportes",
  "/documentos": "Documentos",
  "/equipo": "Equipo",
  "/chat": "Chat",
};

function tituloActual(pathname: string): string {
  if (TITULOS_POR_RUTA[pathname]) return TITULOS_POR_RUTA[pathname];
  // /clientes/[id] -> sigue siendo la sección "Clientes"
  const seccion = Object.keys(TITULOS_POR_RUTA).find((ruta) => pathname.startsWith(`${ruta}/`));
  return seccion ? TITULOS_POR_RUTA[seccion]! : "CRM Seguimiento Comercial";
}

export function AppTopbar() {
  const pathname = usePathname();
  const { usuario, setUsuario } = useUsuarioActualStore();
  // zustand + persist rehidrata desde localStorage DESPUÉS del primer render
  // en cliente — sin esta bandera, el HTML del servidor (siempre el usuario
  // por defecto) no calzaría con el del cliente ya rehidratado.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-6">
      <h1 className="text-sm font-medium text-foreground">{tituloActual(pathname)}</h1>

      {/* TODO(Fase 7): reemplazar por el nombre real de la sesión de Supabase
          Auth — mientras no hay login, esto simula "actuar como" cada persona
          del equipo, para poder probar la vista de admin y el chat. */}
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:inline">Actuando como:</span>
        {montado ? (
          <Select
            value={usuario.id}
            onValueChange={(id) => {
              const seleccionado = USUARIOS_DISPONIBLES.find((u) => u.id === id);
              if (seleccionado) setUsuario(seleccionado);
            }}
          >
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USUARIOS_DISPONIBLES.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.nombre} {u.rol === "admin" ? "· Admin" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="h-8 w-[180px] rounded-md border border-border bg-background" />
        )}
      </div>
    </header>
  );
}
