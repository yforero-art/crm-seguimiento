"use client";

import { ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { EmployeeCard, type EmployeeSummary } from "@/components/equipo/EmployeeCard";
import { TaskForm } from "@/components/tareas/TaskForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CLIENTES_INICIALES } from "@/lib/mock/clientes";
import { OPORTUNIDADES_INICIALES } from "@/lib/mock/oportunidades";
import { USUARIOS_DISPONIBLES } from "@/store/usuarioActualStore";
import { useUsuarioActualStore } from "@/store/usuarioActualStore";
import { TAREAS_INICIALES } from "@/lib/mock/tareas";
import type { TareaInput } from "@/lib/validations/tarea.schema";
import type { Tarea } from "@/types";

export default function EquipoPage() {
  const { usuario } = useUsuarioActualStore();
  const [tareas, setTareas] = useState<Tarea[]>(TAREAS_INICIALES);
  const [empleadoParaTarea, setEmpleadoParaTarea] = useState<string | null>(null);

  // TODO(Fase 7): las tareas creadas aquí solo viven en esta página mientras
  // no hay una fuente de datos compartida (Server Actions reales) — no se
  // reflejan todavía en /tareas. Es la misma limitación de toda la fase mock.
  const resumenEquipo = useMemo<EmployeeSummary[]>(() => {
    return USUARIOS_DISPONIBLES.map((empleado) => {
      const susClientes = CLIENTES_INICIALES.filter((c) => c.responsable_id === empleado.id);
      const susTareas = tareas.filter((t) => t.responsable_id === empleado.id);
      const susOportunidades = OPORTUNIDADES_INICIALES.filter((o) => o.responsable === empleado.nombre);

      const pendientes = susTareas.filter((t) => t.estado === "pendiente");
      const proximasTareas = [...pendientes]
        .sort((a, b) => a.fecha_vencimiento.getTime() - b.fecha_vencimiento.getTime())
        .slice(0, 3);

      return {
        id: empleado.id,
        nombre: empleado.nombre,
        rol: empleado.rol,
        clientesAsignados: susClientes.length,
        tareasPendientes: pendientes.length,
        tareasEnProgreso: susTareas.filter((t) => t.estado === "en_progreso").length,
        tareasCompletadas: susTareas.filter((t) => t.estado === "completada").length,
        valorPipeline: susOportunidades.reduce((sum, o) => sum + o.valor, 0),
        proximasTareas,
      };
    });
  }, [tareas]);

  function handleAsignarTarea(data: TareaInput) {
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
    setEmpleadoParaTarea(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Equipo</h1>
        <p className="text-sm text-muted-foreground">Qué tiene cada quién, cómo van sus tareas y sus clientes asignados.</p>
      </div>

      {usuario.rol !== "admin" && (
        <div className="flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/10 p-3 text-sm text-warning">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          Esta vista es para administradores. Estás actuando como <strong>{usuario.nombre}</strong> (auxiliar) — cámbialo arriba a la
          derecha si necesitas ver esto como admin.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumenEquipo.map((empleado) => (
          <EmployeeCard key={empleado.id} empleado={empleado} onAsignarTarea={setEmpleadoParaTarea} />
        ))}
      </div>

      <Dialog open={!!empleadoParaTarea} onOpenChange={(open) => !open && setEmpleadoParaTarea(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Nueva tarea para {USUARIOS_DISPONIBLES.find((u) => u.id === empleadoParaTarea)?.nombre ?? ""}
            </DialogTitle>
          </DialogHeader>
          {empleadoParaTarea && (
            <TaskForm
              responsableIdInicial={empleadoParaTarea}
              onSubmit={handleAsignarTarea}
              onCancel={() => setEmpleadoParaTarea(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
