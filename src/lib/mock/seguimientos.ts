import type { TimelineSeguimiento } from "@/components/seguimiento/TimelineItem";
import { RESPONSABLE_ANDRES, RESPONSABLE_CAMILA, RESPONSABLE_YESENIA, nombreUsuario } from "@/lib/mock/responsables";
import type { Seguimiento } from "@/types";

const HORA = 60 * 60 * 1000;
const DIA = 24 * HORA;
const hace = (ms: number) => new Date(Date.now() - ms);

// TODO(Fase 3): reemplazar por getSeguimientos(clienteId) (Server Action + RLS).
// Timelines completos solo para un par de clientes de ejemplo — el resto
// arranca vacío, que es el estado real de un prospecto recién creado.
const SEGUIMIENTOS_MOCK: Seguimiento[] = [
  // Alpha Ambulancias S.A.S. — c1a00000-...-0001
  {
    id: "s0000000-0000-4000-8000-000000000001",
    cliente_id: "c1a00000-0000-4000-8000-000000000001",
    tipo: "reunion",
    descripcion: "Reunión con gerente sobre contrato anual",
    resultado: "positivo",
    duracion_minutos: 45,
    usuario_id: RESPONSABLE_YESENIA.id,
    created_at: hace(2 * HORA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000002",
    cliente_id: "c1a00000-0000-4000-8000-000000000001",
    tipo: "llamada",
    descripcion: "Seguimiento a propuesta enviada",
    resultado: "positivo",
    duracion_minutos: 20,
    usuario_id: RESPONSABLE_YESENIA.id,
    created_at: hace(1 * DIA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000003",
    cliente_id: "c1a00000-0000-4000-8000-000000000001",
    tipo: "correo",
    descripcion: "Envío de presupuesto para servicio premium",
    resultado: "neutral",
    duracion_minutos: null,
    usuario_id: RESPONSABLE_YESENIA.id,
    created_at: hace(3 * DIA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000004",
    cliente_id: "c1a00000-0000-4000-8000-000000000001",
    tipo: "reunion",
    descripcion: "Presentación de servicios",
    resultado: "positivo",
    duracion_minutos: 60,
    usuario_id: RESPONSABLE_YESENIA.id,
    created_at: hace(7 * DIA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000005",
    cliente_id: "c1a00000-0000-4000-8000-000000000001",
    tipo: "whatsapp",
    descripcion: "Confirmación de reunión",
    resultado: "positivo",
    duracion_minutos: null,
    usuario_id: RESPONSABLE_YESENIA.id,
    created_at: hace(7 * DIA + 3 * HORA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000006",
    cliente_id: "c1a00000-0000-4000-8000-000000000001",
    tipo: "nota",
    descripcion: "Cliente interesado en auditoría interna",
    resultado: "neutral",
    duracion_minutos: null,
    usuario_id: RESPONSABLE_YESENIA.id,
    created_at: hace(14 * DIA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000007",
    cliente_id: "c1a00000-0000-4000-8000-000000000001",
    tipo: "llamada",
    descripcion: "Llamada fría de presentación",
    resultado: "positivo",
    duracion_minutos: 15,
    usuario_id: RESPONSABLE_YESENIA.id,
    created_at: hace(30 * DIA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000008",
    cliente_id: "c1a00000-0000-4000-8000-000000000001",
    tipo: "correo",
    descripcion: "Primer contacto vía email",
    resultado: "neutral",
    duracion_minutos: null,
    usuario_id: RESPONSABLE_YESENIA.id,
    created_at: hace(31 * DIA),
  },

  // La Spaghettata — c1a00000-...-0002 (prospecto reciente, timeline corto)
  {
    id: "s0000000-0000-4000-8000-000000000009",
    cliente_id: "c1a00000-0000-4000-8000-000000000002",
    tipo: "correo",
    descripcion: "Primer contacto, envío de información general de servicios contables",
    resultado: "neutral",
    duracion_minutos: null,
    usuario_id: RESPONSABLE_ANDRES.id,
    created_at: hace(5 * DIA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000010",
    cliente_id: "c1a00000-0000-4000-8000-000000000002",
    tipo: "whatsapp",
    descripcion: "Cliente pidió cotización de servicios contables mensuales",
    resultado: "positivo",
    duracion_minutos: null,
    usuario_id: RESPONSABLE_ANDRES.id,
    created_at: hace(2 * DIA),
  },

  // X-Data Colombia — c1a00000-...-0003 (en etapa de reunión)
  {
    id: "s0000000-0000-4000-8000-000000000011",
    cliente_id: "c1a00000-0000-4000-8000-000000000003",
    tipo: "reunion",
    descripcion: "Reunión inicial para entender necesidades del área financiera",
    resultado: "positivo",
    duracion_minutos: 40,
    usuario_id: RESPONSABLE_CAMILA.id,
    created_at: hace(4 * DIA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000012",
    cliente_id: "c1a00000-0000-4000-8000-000000000003",
    tipo: "correo",
    descripcion: "Envío de propuesta preliminar con alcance y honorarios",
    resultado: "neutral",
    duracion_minutos: null,
    usuario_id: RESPONSABLE_CAMILA.id,
    created_at: hace(2 * DIA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000013",
    cliente_id: "c1a00000-0000-4000-8000-000000000003",
    tipo: "llamada",
    descripcion: "Aclaración de dudas sobre alcance del servicio",
    resultado: "positivo",
    duracion_minutos: 12,
    usuario_id: RESPONSABLE_CAMILA.id,
    created_at: hace(1 * DIA),
  },
  {
    id: "s0000000-0000-4000-8000-000000000014",
    cliente_id: "c1a00000-0000-4000-8000-000000000003",
    tipo: "nota",
    descripcion: "Pendiente definir presupuesto con junta directiva antes de avanzar",
    resultado: "neutral",
    duracion_minutos: null,
    usuario_id: RESPONSABLE_CAMILA.id,
    created_at: hace(6 * HORA),
  },
];

function toTimelineSeguimiento(s: Seguimiento): TimelineSeguimiento {
  return {
    id: s.id,
    tipo: s.tipo,
    descripcion: s.descripcion,
    resultado: s.resultado,
    duracion_minutos: s.duracion_minutos,
    usuario: nombreUsuario(s.usuario_id) ?? "Usuario",
    created_at: s.created_at,
  };
}

export function getSeguimientosCliente(clienteId: string): TimelineSeguimiento[] {
  return SEGUIMIENTOS_MOCK.filter((s) => s.cliente_id === clienteId).map(toTimelineSeguimiento);
}
