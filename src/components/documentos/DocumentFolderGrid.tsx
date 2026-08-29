"use client";

import { Folder } from "lucide-react";
import { useMemo } from "react";
import type { DocumentoItem } from "@/components/documentos/DocumentList";
import { formatFileSize } from "@/lib/utils/format";

// Sentinel interno para agrupar documentos sin cliente asociado (tareas
// administrativas, adjuntos generales) — no es un nombre de cliente real.
export const SIN_CLIENTE = "__sin_cliente__";

interface Carpeta {
  clienteKey: string;
  nombre: string;
  documentos: DocumentoItem[];
}

interface DocumentFolderGridProps {
  documentos: DocumentoItem[];
  onAbrirCarpeta: (clienteKey: string) => void;
}

export function DocumentFolderGrid({ documentos, onAbrirCarpeta }: DocumentFolderGridProps) {
  const carpetas = useMemo<Carpeta[]>(() => {
    const mapa = new Map<string, DocumentoItem[]>();
    for (const doc of documentos) {
      const clave = doc.cliente ?? SIN_CLIENTE;
      const lista = mapa.get(clave) ?? [];
      lista.push(doc);
      mapa.set(clave, lista);
    }

    return Array.from(mapa.entries())
      .map(([clienteKey, docs]) => ({ clienteKey, nombre: clienteKey === SIN_CLIENTE ? "Sin cliente" : clienteKey, documentos: docs }))
      .sort((a, b) => {
        if (a.clienteKey === SIN_CLIENTE) return 1;
        if (b.clienteKey === SIN_CLIENTE) return -1;
        return a.nombre.localeCompare(b.nombre, "es");
      });
  }, [documentos]);

  if (carpetas.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center text-sm text-muted-foreground">
        Todavía no hay documentos.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {carpetas.map((carpeta) => {
        const tamanoTotal = carpeta.documentos.reduce((sum, d) => sum + d.tamanoBytes, 0);
        return (
          <button
            key={carpeta.clienteKey}
            type="button"
            onClick={() => onAbrirCarpeta(carpeta.clienteKey)}
            className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Folder className="h-5 w-5" />
            </div>
            <p className="line-clamp-2 text-sm font-medium text-foreground">{carpeta.nombre}</p>
            <p className="text-xs text-muted-foreground">
              {carpeta.documentos.length} {carpeta.documentos.length === 1 ? "documento" : "documentos"} · {formatFileSize(tamanoTotal)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
