"use client";

import { AlertCircle, Clock, Pencil, Trash2 } from "lucide-react";
import { EstadoBadge } from "@/components/shared/EstadoBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/cn";
import { COLOR_TOKEN_CLASSES } from "@/lib/utils/constants";
import { formatFechaTarea } from "@/lib/utils/format";
import { getUrgenciaTarea } from "@/lib/utils/tareas";
import type { EstadoTarea, Prioridad } from "@/types";

export interface TareaCard {
  id: string;
  titulo: string;
  descripcion?: string;
  cliente?: string;
  fecha_vencimiento: Date;
  prioridad: Prioridad;
  estado: EstadoTarea;
}

interface TaskCardProps extends TareaCard {
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const URGENCIA_COLOR = {
  vencida: "rojo",
  hoy: "naranja",
  futura: "gris",
} as const;

export function TaskCard({
  id,
  titulo,
  descripcion,
  cliente,
  fecha_vencimiento,
  prioridad,
  estado,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const completada = estado === "completada";
  const urgencia = getUrgenciaTarea(fecha_vencimiento, estado);
  const barra = COLOR_TOKEN_CLASSES[URGENCIA_COLOR[urgencia]];

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 overflow-hidden rounded-lg border border-border bg-card p-3 pl-5 shadow-sm transition-all duration-200 hover:shadow-md",
        completada && "opacity-60"
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", barra.solid)} aria-hidden />

      <Checkbox
        checked={completada}
        onCheckedChange={() => onToggleComplete?.(id)}
        className="mt-0.5 shrink-0"
        aria-label={completada ? "Marcar como pendiente" : "Marcar como completada"}
      />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium text-foreground", completada && "text-muted-foreground line-through")}>
            {titulo}
          </p>
          <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Editar tarea" onClick={() => onEdit(id)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Eliminar tarea"
                onClick={() => onDelete(id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {cliente && <p className="truncate text-xs text-muted-foreground">{cliente}</p>}
        {descripcion && !completada && <p className="line-clamp-2 text-xs text-muted-foreground">{descripcion}</p>}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              urgencia === "vencida" ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {urgencia === "vencida" ? <AlertCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
            {formatFechaTarea(fecha_vencimiento)}
          </span>
          <EstadoBadge estado={prioridad} tamano="sm" />
          <EstadoBadge estado={estado} tamano="sm" />
        </div>
      </div>
    </div>
  );
}
