"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";
import { PROXIMOS_PASOS } from "@/lib/utils/constants";

interface ProximoPasoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paso: string) => void;
  onSkip: () => void;
}

// Segundo paso del flujo de registro de seguimiento: al guardar un
// seguimiento, esto pregunta si hay un próximo paso — de ser así, crea
// automáticamente una tarea ("Guardar y Crear Tarea"); si se omite, el
// seguimiento queda guardado sin tarea asociada ("Guardar Sin Tarea").
export function ProximoPasoDialog({ open, onOpenChange, onConfirm, onSkip }: ProximoPasoDialogProps) {
  const [seleccion, setSeleccion] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (!next) setSeleccion(null);
    onOpenChange(next);
  }

  function handleConfirm() {
    if (!seleccion) return;
    onConfirm(seleccion);
    setSeleccion(null);
  }

  function handleSkip() {
    onSkip();
    setSeleccion(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¿Cuál es el próximo paso?</DialogTitle>
          <DialogDescription>Si eliges una opción, se crea automáticamente una tarea de seguimiento.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 py-2">
          {PROXIMOS_PASOS.map((paso) => (
            <button
              key={paso}
              type="button"
              onClick={() => setSeleccion(paso)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                seleccion === paso
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {paso}
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleSkip}>
            Guardar Sin Tarea
          </Button>
          <Button onClick={handleConfirm} disabled={!seleccion}>
            Guardar y Crear Tarea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
