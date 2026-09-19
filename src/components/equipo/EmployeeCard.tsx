import { Plus, Users } from "lucide-react";
import { EstadoBadge } from "@/components/shared/EstadoBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyCompact } from "@/lib/utils/format";
import { formatFechaTarea } from "@/lib/utils/format";
import type { Tarea } from "@/types";

export interface EmployeeSummary {
  id: string;
  nombre: string;
  rol: "admin" | "auxiliar";
  clientesAsignados: number;
  tareasPendientes: number;
  tareasEnProgreso: number;
  tareasCompletadas: number;
  valorPipeline: number;
  proximasTareas: Tarea[];
}

interface EmployeeCardProps {
  empleado: EmployeeSummary;
  onAsignarTarea: (empleadoId: string) => void;
}

function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

export function EmployeeCard({ empleado, onAsignarTarea }: EmployeeCardProps) {
  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {iniciales(empleado.nombre)}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{empleado.nombre}</p>
              <p className="text-xs capitalize text-muted-foreground">{empleado.rol === "admin" ? "Administrador" : "Auxiliar comercial"}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onAsignarTarea(empleado.id)}>
            <Plus className="h-3.5 w-3.5" />
            Tarea
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-md bg-muted/50 p-2">
            <p className="text-lg font-bold tabular-nums text-foreground">{empleado.clientesAsignados}</p>
            <p className="text-[10px] text-muted-foreground">Clientes</p>
          </div>
          <div className="rounded-md bg-muted/50 p-2">
            <p className="text-lg font-bold tabular-nums text-primary">{empleado.tareasPendientes}</p>
            <p className="text-[10px] text-muted-foreground">Pendientes</p>
          </div>
          <div className="rounded-md bg-muted/50 p-2">
            <p className="text-lg font-bold tabular-nums text-orange">{empleado.tareasEnProgreso}</p>
            <p className="text-[10px] text-muted-foreground">En curso</p>
          </div>
          <div className="rounded-md bg-muted/50 p-2">
            <p className="text-lg font-bold tabular-nums text-success">{empleado.tareasCompletadas}</p>
            <p className="text-[10px] text-muted-foreground">Hechas</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Pipeline asignado: <span className="font-medium text-foreground">{formatCurrencyCompact(empleado.valorPipeline)}</span>
        </p>

        <div className="space-y-1.5 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">Próximo por hacer</p>
          {empleado.proximasTareas.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Sin tareas pendientes.
            </div>
          ) : (
            empleado.proximasTareas.map((tarea) => (
              <div key={tarea.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-foreground">{tarea.titulo}</span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <EstadoBadge estado={tarea.prioridad} tamano="sm" />
                  <span className="text-muted-foreground">{formatFechaTarea(tarea.fecha_vencimiento)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
