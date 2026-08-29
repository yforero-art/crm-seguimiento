import { isPast, isToday } from "date-fns";
import type { EstadoTarea } from "@/types";

export type UrgenciaTarea = "vencida" | "hoy" | "futura";

/**
 * Urgencia visual del borde izquierdo de TaskCard. Una tarea completada o
 * cancelada nunca se marca "vencida" — ya no compite por atención.
 */
export function getUrgenciaTarea(fechaVencimiento: Date, estado: EstadoTarea): UrgenciaTarea {
  if (estado === "completada" || estado === "cancelada") return "futura";
  if (isToday(fechaVencimiento)) return "hoy";
  if (isPast(fechaVencimiento)) return "vencida";
  return "futura";
}
