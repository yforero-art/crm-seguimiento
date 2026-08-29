"use client";

import { usePathname } from "next/navigation";

const TITULOS_POR_RUTA: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clientes": "Clientes",
  "/pipeline": "Pipeline",
  "/tareas": "Tareas",
  "/calendario": "Calendario",
  "/reportes": "Reportes",
  "/documentos": "Documentos",
};

function tituloActual(pathname: string): string {
  if (TITULOS_POR_RUTA[pathname]) return TITULOS_POR_RUTA[pathname];
  // /clientes/[id] -> sigue siendo la sección "Clientes"
  const seccion = Object.keys(TITULOS_POR_RUTA).find((ruta) => pathname.startsWith(`${ruta}/`));
  return seccion ? TITULOS_POR_RUTA[seccion]! : "CRM Seguimiento Comercial";
}

export function AppTopbar() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center border-b border-border bg-card px-4 md:px-6">
      <h1 className="text-sm font-medium text-foreground">{tituloActual(pathname)}</h1>
    </header>
  );
}
