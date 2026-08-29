"use client";

import { isSameMonth } from "date-fns";
import { CheckCircle, Clock, ListTodo, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskForm } from "@/components/tareas/TaskForm";
import { TaskList } from "@/components/tareas/TaskList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CLIENTES_INICIALES } from "@/lib/mock/clientes";
import { TAREAS_INICIALES } from "@/lib/mock/tareas";
import type { TareaInput } from "@/lib/validations/tarea.schema";
import type { Tarea } from "@/types";

function nombreCliente(clienteId: string | null): string | undefined {
  if (!clienteId) return undefined;
  return CLIENTES_INICIALES.find((c) => c.id === clienteId)?.empresa;
}

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>(TAREAS_INICIALES);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<Tarea | null>(null);

  const stats = useMemo(() => {
    const hoy = new Date();
    return {
      pendientes: tareas.filter((t) => t.estado === "pendiente").length,
      enProgreso: tareas.filter((t) => t.estado === "en_progreso").length,
      completadasEsteMes: tareas.filter((t) => t.estado === "completada" && isSameMonth(t.fecha_vencimiento, hoy)).length,
    };
  }, [tareas]);

  const tareasVista = useMemo(
    () =>
      tareas.map((t) => ({
        id: t.id,
        titulo: t.titulo,
        descripcion: t.descripcion ?? undefined,
        cliente: nombreCliente(t.cliente_id),
        fecha_vencimiento: t.fecha_vencimiento,
        prioridad: t.prioridad,
        estado: t.estado,
      })),
    [tareas]
  );

  function handleToggleComplete(id: string) {
    // TODO(Fase 5): reemplazar por updateTarea() (Server Action).
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: t.estado === "completada" ? "pendiente" : "completada" } : t))
    );
  }

  function handleNueva() {
    setTareaEditando(null);
    setDialogAbierto(true);
  }

  function handleEdit(id: string) {
    setTareaEditando(tareas.find((t) => t.id === id) ?? null);
    setDialogAbierto(true);
  }

  function handleDeleteRequest(id: string) {
    setTareaAEliminar(tareas.find((t) => t.id === id) ?? null);
  }

  function handleDeleteConfirm() {
    if (!tareaAEliminar) return;
    // TODO(Fase 5): reemplazar por deleteTarea() (Server Action).
    setTareas((prev) => prev.filter((t) => t.id !== tareaAEliminar.id));
    setTareaAEliminar(null);
  }

  function handleSubmit(data: TareaInput) {
    // TODO(Fase 5): reemplazar por createTarea()/updateTarea() (Server Actions).
    if (tareaEditando) {
      setTareas((prev) =>
        prev.map((t) =>
          t.id === tareaEditando.id
            ? { ...t, ...data, descripcion: data.descripcion || null, cliente_id: data.cliente_id ?? null }
            : t
        )
      );
    } else {
      const nueva: Tarea = {
        id: crypto.randomUUID(),
        titulo: data.titulo,
        descripcion: data.descripcion || null,
        cliente_id: data.cliente_id ?? null,
        responsable_id: data.responsable_id,
        fecha_vencimiento: data.fecha_vencimiento,
        prioridad: data.prioridad,
        estado: data.estado,
        created_at: new Date(),
      };
      setTareas((prev) => [nueva, ...prev]);
    }
    setDialogAbierto(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Tareas</h1>
        <Button onClick={handleNueva} className="bg-success text-success-foreground hover:bg-success/90 sm:w-auto">
          <Plus className="h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Pendientes" value={stats.pendientes} icon={<ListTodo className="h-5 w-5" />} color="blue" />
        <StatCard title="En Progreso" value={stats.enProgreso} icon={<Clock className="h-5 w-5" />} color="gray" />
        <StatCard title="Completadas Este Mes" value={stats.completadasEsteMes} icon={<CheckCircle className="h-5 w-5" />} color="green" />
      </div>

      <TaskList tareas={tareasVista} onToggleComplete={handleToggleComplete} onEdit={handleEdit} onDelete={handleDeleteRequest} />

      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{tareaEditando ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
          </DialogHeader>
          <TaskForm tarea={tareaEditando ?? undefined} onSubmit={handleSubmit} onCancel={() => setDialogAbierto(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!tareaAEliminar} onOpenChange={(open) => !open && setTareaAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta tarea?</AlertDialogTitle>
            <AlertDialogDescription>
              {tareaAEliminar && (
                <>
                  Se eliminará <span className="font-medium text-foreground">&ldquo;{tareaAEliminar.titulo}&rdquo;</span>. Esta acción no
                  se puede deshacer.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
