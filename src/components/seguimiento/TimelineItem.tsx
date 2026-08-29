"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { EstadoBadge } from "@/components/shared/EstadoBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { COLOR_TOKEN_CLASSES, TIPOS_SEGUIMIENTO } from "@/lib/utils/constants";
import type { ResultadoSeguimiento, TipoSeguimiento } from "@/types";

export interface TimelineSeguimiento {
  id: string;
  tipo: TipoSeguimiento;
  descripcion: string;
  resultado: ResultadoSeguimiento;
  duracion_minutos?: number | null;
  usuario: string;
  created_at: Date;
}

interface TimelineItemProps {
  seguimiento: TimelineSeguimiento;
  isLast?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const DESCRIPCION_LARGA = 180;

export function TimelineItem({ seguimiento, isLast = false, onEdit, onDelete }: TimelineItemProps) {
  const [expandido, setExpandido] = useState(false);
  const { label: tipoLabel, icon: Icon, color } = TIPOS_SEGUIMIENTO[seguimiento.tipo];
  const styles = COLOR_TOKEN_CLASSES[color];
  const esLarga = seguimiento.descripcion.length > DESCRIPCION_LARGA;

  return (
    <li className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
            styles.bg,
            styles.text
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        {!isLast && <span className="mt-1 w-px flex-1 bg-border" aria-hidden />}
      </div>

      <div
        className={cn(
          "group relative flex-1 overflow-hidden rounded-lg border border-border bg-card p-4 pl-5 shadow-sm transition-shadow hover:shadow-md",
          !isLast && "mb-6"
        )}
      >
        <span className={cn("absolute inset-y-0 left-0 w-1", styles.solid)} aria-hidden />

        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{tipoLabel}</span>
            <span aria-hidden>·</span>
            <span>{seguimiento.usuario}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {formatDistanceToNowStrict(seguimiento.created_at, { addSuffix: true, locale: es })}
            </span>
            <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="Editar seguimiento"
                  onClick={() => onEdit(seguimiento.id)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Eliminar seguimiento"
                  onClick={() => onDelete(seguimiento.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className={cn("mt-2 whitespace-pre-line text-sm text-foreground", esLarga && !expandido && "line-clamp-3")}>
          {seguimiento.descripcion}
        </p>
        {esLarga && (
          <button
            type="button"
            onClick={() => setExpandido((v) => !v)}
            className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
          >
            {expandido ? "Ver menos" : "Ver más"}
            {expandido ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <EstadoBadge estado={seguimiento.resultado} tamano="sm" />
          {!!seguimiento.duracion_minutos && (
            <span className="text-xs text-muted-foreground">{seguimiento.duracion_minutos} min</span>
          )}
        </div>
      </div>
    </li>
  );
}
