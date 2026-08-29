"use client";

import { History, Plus } from "lucide-react";
import { useMemo } from "react";
import { TimelineItem, type TimelineSeguimiento } from "@/components/seguimiento/TimelineItem";
import { Button } from "@/components/ui/button";

interface TimelineProps {
  seguimientos: TimelineSeguimiento[];
  onAddSeguimiento?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function Timeline({ seguimientos, onAddSeguimiento, onEdit, onDelete }: TimelineProps) {
  const ordenados = useMemo(
    () => [...seguimientos].sort((a, b) => b.created_at.getTime() - a.created_at.getTime()),
    [seguimientos]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {ordenados.length} {ordenados.length === 1 ? "interacción registrada" : "interacciones registradas"}
        </p>
        {onAddSeguimiento && (
          <Button onClick={onAddSeguimiento} size="sm">
            <Plus className="h-4 w-4" />
            Agregar Seguimiento
          </Button>
        )}
      </div>

      {ordenados.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <History className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Aún no hay seguimientos</p>
            <p className="text-sm text-muted-foreground">Registra la primera interacción con este cliente.</p>
          </div>
        </div>
      ) : (
        <ol className="space-y-0">
          {ordenados.map((seguimiento, index) => (
            <TimelineItem
              key={seguimiento.id}
              seguimiento={seguimiento}
              isLast={index === ordenados.length - 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
