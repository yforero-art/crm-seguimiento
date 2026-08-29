"use client";

import { Copy, DollarSign, Pencil, Percent } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { formatCurrencyCompact } from "@/lib/utils/format";
import { getEtapaConfig } from "@/lib/utils/pipeline";
import type { EtapaOportunidad } from "@/types";

export interface KanbanOportunidad {
  id: string;
  titulo: string;
  empresa: string;
  valor: number;
  probabilidad: number;
  responsable: string;
  etapa: EtapaOportunidad;
  moneda?: "COP" | "USD";
}

interface KanbanCardProps extends KanbanOportunidad {
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  isDragging?: boolean;
  // Tipado laxo a propósito: dnd-kit expone `attributes`/`listeners` con tipos
  // propios (DraggableAttributes / SyntheticListenerMap) que no calzan 1:1 con
  // React.HTMLAttributes — se spreadean tal cual sobre el elemento raíz.
  dragHandleProps?: Record<string, unknown>;
  style?: React.CSSProperties;
  className?: string;
}

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  const letras = partes.slice(0, 2).map((p) => p.charAt(0).toUpperCase());
  return letras.join("") || "?";
}

export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(function KanbanCard(
  { id, titulo, empresa, valor, probabilidad, responsable, etapa, moneda = "COP", onEdit, onDuplicate, isDragging, dragHandleProps, style, className },
  ref
) {
  const { color } = getEtapaConfig(etapa);
  const valorEsperado = Math.round((valor * probabilidad) / 100);

  return (
    <div
      ref={ref}
      style={{ borderTopColor: color, ...style }}
      className={cn(
        "group relative touch-none cursor-grab select-none rounded-lg border border-t-4 border-border bg-card p-3 shadow-sm transition-all duration-200 active:cursor-grabbing",
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md",
        className
      )}
      {...dragHandleProps}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-tight text-foreground">{titulo}</p>
        <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Editar oportunidad"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDuplicate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Duplicar oportunidad"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-0.5 truncate text-xs text-muted-foreground">{empresa}</p>

      <div className="mt-2.5 flex items-center gap-1.5 text-foreground">
        <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-base font-bold tabular-nums">{formatCurrencyCompact(valor, moneda)}</span>
      </div>
      <p className="pl-[22px] text-[11px] text-muted-foreground">Esperado: {formatCurrencyCompact(valorEsperado, moneda)}</p>

      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          <Percent className="h-3 w-3" />
          {probabilidad}%
        </span>
        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
          title={responsable}
        >
          {iniciales(responsable)}
        </div>
      </div>
    </div>
  );
});
