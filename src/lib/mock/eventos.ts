import type { EventoCalendario } from "@/components/calendario/CalendarGrid";
import { fechaLocal } from "@/lib/utils/format";

// TODO(Fase 6): reemplazar por getEventos() (Server Action + RLS) — hoy
// combina tareas.fecha_vencimiento + seguimientos agendados; agosto 2026
// porque coincide con el mes actual (currentDate = 2026-08-20).
export const EVENTOS_INICIALES: EventoCalendario[] = [
  { id: "e01", titulo: "Llamada a Tech Solutions Colombia", hora: "09:00", tipo: "llamada", fecha: fechaLocal(2026, 8, 3) },
  { id: "e02", titulo: "Reunión con Alpha Ambulancias", hora: "10:00", tipo: "reunion", fecha: fechaLocal(2026, 8, 5) },
  { id: "e03", titulo: "Preparar propuesta para X-Data Colombia", hora: "14:00", tipo: "tarea", fecha: fechaLocal(2026, 8, 7) },
  { id: "e04", titulo: "Entregar contrato a Distribuidora La Sabana", hora: "11:00", tipo: "entrega", fecha: fechaLocal(2026, 8, 10) },
  { id: "e05", titulo: "Llamada a Constructora Andina", hora: "15:30", tipo: "llamada", fecha: fechaLocal(2026, 8, 12) },
  { id: "e06", titulo: "Reunión con La Spaghettata", hora: "09:30", tipo: "reunion", fecha: fechaLocal(2026, 8, 14) },
  { id: "e07", titulo: "Reunión con Option Marketing", hora: "10:00", tipo: "reunion", fecha: fechaLocal(2026, 8, 17) },
  { id: "e08", titulo: "Llamada de seguimiento AutoRepuestos del Valle", hora: "08:30", tipo: "llamada", fecha: fechaLocal(2026, 8, 18) },
  { id: "e09", titulo: "Revisar cotización Ferretería Central", hora: "13:00", tipo: "tarea", fecha: fechaLocal(2026, 8, 19) },
  { id: "e10", titulo: "Reunión con equipo comercial", hora: "09:00", tipo: "reunion", fecha: fechaLocal(2026, 8, 20) },
  { id: "e11", titulo: "Entregar propuesta a Fashion Group", hora: "16:00", tipo: "entrega", fecha: fechaLocal(2026, 8, 20) },
  { id: "e12", titulo: "Llamada a CRM Desarrollo", hora: "11:00", tipo: "llamada", fecha: fechaLocal(2026, 8, 21) },
  { id: "e13", titulo: "Preparar auditoría para Auditoría Plus", hora: "10:00", tipo: "tarea", fecha: fechaLocal(2026, 8, 22) },
  { id: "e14", titulo: "Reunión con Transportes El Dorado", hora: "14:30", tipo: "reunion", fecha: fechaLocal(2026, 8, 25) },
  { id: "e15", titulo: "Entregar informe fiscal mensual", hora: "17:00", tipo: "entrega", fecha: fechaLocal(2026, 8, 27) },
];
