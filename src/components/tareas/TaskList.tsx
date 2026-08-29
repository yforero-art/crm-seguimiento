"use client";

import { ListChecks } from "lucide-react";
import { useMemo } from "react";
import { TaskCard, type TareaCard } from "@/components/tareas/TaskCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EstadoTarea } from "@/types";

interface TaskListProps {
  tareas: TareaCard[];
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TABS: { value: string; label: string; estados: EstadoTarea[] | null }[] = [
  { value: "pendientes", label: "Pendientes", estados: ["pendiente"] },
  { value: "en_progreso", label: "En Progreso", estados: ["en_progreso"] },
  { value: "completadas", label: "Completadas", estados: ["completada"] },
  { value: "todas", label: "Todas", estados: null },
];

function ordenarPorVencimiento(tareas: TareaCard[]): TareaCard[] {
  return [...tareas].sort((a, b) => a.fecha_vencimiento.getTime() - b.fecha_vencimiento.getTime());
}

export function TaskList({ tareas, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  const porTab = useMemo(() => {
    const resultado: Record<string, TareaCard[]> = {};
    for (const tab of TABS) {
      const filtradas = tab.estados ? tareas.filter((t) => tab.estados!.includes(t.estado)) : tareas;
      resultado[tab.value] = ordenarPorVencimiento(filtradas);
    }
    return resultado;
  }, [tareas]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Mis Tareas</h2>

      <Tabs defaultValue="pendientes">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <span className="ml-1.5 text-xs text-muted-foreground">({porTab[tab.value]?.length ?? 0})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4 space-y-2">
            {porTab[tab.value]?.length ? (
              porTab[tab.value]!.map((tarea) => (
                <TaskCard key={tarea.id} {...tarea} onToggleComplete={onToggleComplete} onEdit={onEdit} onDelete={onDelete} />
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-card py-12 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ListChecks className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">No hay tareas en esta vista.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
