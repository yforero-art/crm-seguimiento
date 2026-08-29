import { RESPONSABLE_ANDRES, RESPONSABLE_CAMILA, RESPONSABLE_YESENIA } from "@/lib/mock/responsables";
import type { EstadoTarea, Prioridad, Tarea } from "@/types";

const RESPONSABLES_ROTACION = [RESPONSABLE_YESENIA.id, RESPONSABLE_ANDRES.id, RESPONSABLE_CAMILA.id];

// IDs de CLIENTES_INICIALES (lib/mock/clientes.ts) — se referencian directo
// para no duplicar el dataset; algunas tareas quedan sin cliente_id (null) a
// propósito (tareas administrativas o prospectos que aún no son un Cliente).
const CLIENTE = {
  alphaAmbulancias: "c1a00000-0000-4000-8000-000000000001",
  laSpaghettata: "c1a00000-0000-4000-8000-000000000002",
  xData: "c1a00000-0000-4000-8000-000000000003",
  solucionesYCalidad: "c1a00000-0000-4000-8000-000000000004",
  optionMarketing: "c1a00000-0000-4000-8000-000000000005",
  crmDesarrollo: "c1a00000-0000-4000-8000-000000000006",
  consultoriaFiscalPlus: "c1a00000-0000-4000-8000-000000000007",
  transportesElDorado: "c1a00000-0000-4000-8000-000000000008",
  constructoraAndina: "c1a00000-0000-4000-8000-000000000009",
  drogueriasSanRafael: "c1a00000-0000-4000-8000-000000000011",
  autoRepuestosDelValle: "c1a00000-0000-4000-8000-000000000012",
  distribuidoraLaSabana: "c1a00000-0000-4000-8000-000000000013",
  ferreteriaCentral: "c1a00000-0000-4000-8000-000000000015",
};

function diasDesdeHoy(offset: number): Date {
  const fecha = new Date();
  fecha.setHours(12, 0, 0, 0);
  fecha.setDate(fecha.getDate() + offset);
  return fecha;
}

interface TareaSeed {
  titulo: string;
  descripcion?: string;
  cliente_id: string | null;
  diasVencimiento: number;
  prioridad: Prioridad;
  estado: EstadoTarea;
}

// TODO(Fase 5): reemplazar por getTareas() (Server Action + RLS).
const SEEDS: TareaSeed[] = [
  // Pendientes (8)
  { titulo: "Llamar a Alpha Ambulancias", cliente_id: CLIENTE.alphaAmbulancias, diasVencimiento: 0, prioridad: "alta", estado: "pendiente" },
  {
    titulo: "Enviar propuesta a Constructora Andina",
    cliente_id: CLIENTE.constructoraAndina,
    diasVencimiento: -2,
    prioridad: "alta",
    estado: "pendiente",
  },
  {
    titulo: "Confirmación de reunión con La Spaghettata",
    cliente_id: CLIENTE.laSpaghettata,
    diasVencimiento: 1,
    prioridad: "media",
    estado: "pendiente",
  },
  {
    titulo: "Revisar cotización de Tech Solutions",
    descripcion: "Prospecto del pipeline, todavía sin ficha de cliente — validar alcance antes de convertir.",
    cliente_id: null,
    diasVencimiento: 3,
    prioridad: "media",
    estado: "pendiente",
  },
  {
    titulo: "Seguimiento a cliente sin contacto hace 15 días",
    descripcion: "Revisar el listado de clientes activos sin interacción reciente y priorizar por valor de pipeline.",
    cliente_id: null,
    diasVencimiento: 0,
    prioridad: "alta",
    estado: "pendiente",
  },
  {
    titulo: "Preparar presentación para restaurantes",
    cliente_id: null,
    diasVencimiento: 5,
    prioridad: "media",
    estado: "pendiente",
  },
  { titulo: "Enviar contrato firmado a X-Data", cliente_id: CLIENTE.xData, diasVencimiento: 1, prioridad: "media", estado: "pendiente" },
  {
    titulo: "Agendar auditoría con Auditoría Plus",
    cliente_id: null,
    diasVencimiento: 2,
    prioridad: "baja",
    estado: "pendiente",
  },

  // En Progreso (3)
  {
    titulo: "Análisis de propuesta Distribuidora La Sabana",
    cliente_id: CLIENTE.distribuidoraLaSabana,
    diasVencimiento: 2,
    prioridad: "media",
    estado: "en_progreso",
  },
  {
    titulo: "Redacción de informe fiscal para Fashion Group",
    cliente_id: null,
    diasVencimiento: 4,
    prioridad: "alta",
    estado: "en_progreso",
  },
  {
    titulo: "Revisión de documentos de Retail Plus",
    cliente_id: null,
    diasVencimiento: 6,
    prioridad: "baja",
    estado: "en_progreso",
  },

  // Completadas (10)
  { titulo: "Llamada con gerente de Alpha", cliente_id: CLIENTE.alphaAmbulancias, diasVencimiento: -1, prioridad: "media", estado: "completada" },
  { titulo: "Envío de presupuesto a Industrial Metals", cliente_id: null, diasVencimiento: -2, prioridad: "media", estado: "completada" },
  { titulo: "Reunión con equipo de ventas", cliente_id: null, diasVencimiento: -3, prioridad: "baja", estado: "completada" },
  {
    titulo: "Actualización de datos fiscales de CRM Desarrollo",
    cliente_id: CLIENTE.crmDesarrollo,
    diasVencimiento: -4,
    prioridad: "media",
    estado: "completada",
  },
  {
    titulo: "Cotización enviada a Ferretería Central",
    cliente_id: CLIENTE.ferreteriaCentral,
    diasVencimiento: -5,
    prioridad: "baja",
    estado: "completada",
  },
  {
    titulo: "Visita a Transportes El Dorado",
    cliente_id: CLIENTE.transportesElDorado,
    diasVencimiento: -6,
    prioridad: "media",
    estado: "completada",
  },
  { titulo: "Cierre de mes contable", cliente_id: null, diasVencimiento: -7, prioridad: "alta", estado: "completada" },
  {
    titulo: "Llamada de seguimiento a AutoRepuestos del Valle",
    cliente_id: CLIENTE.autoRepuestosDelValle,
    diasVencimiento: -8,
    prioridad: "media",
    estado: "completada",
  },
  {
    titulo: "Firma de contrato con Soluciones y Calidad Empresarial",
    cliente_id: CLIENTE.solucionesYCalidad,
    diasVencimiento: -10,
    prioridad: "alta",
    estado: "completada",
  },
  {
    titulo: "Entrega de informe a Option Marketing",
    cliente_id: CLIENTE.optionMarketing,
    diasVencimiento: -12,
    prioridad: "media",
    estado: "completada",
  },

  // Canceladas (2)
  {
    titulo: "Reunión cancelada con Consultoría Fiscal Plus",
    cliente_id: CLIENTE.consultoriaFiscalPlus,
    diasVencimiento: -1,
    prioridad: "baja",
    estado: "cancelada",
  },
  {
    titulo: "Propuesta descartada para Droguerías San Rafael",
    cliente_id: CLIENTE.drogueriasSanRafael,
    diasVencimiento: -3,
    prioridad: "media",
    estado: "cancelada",
  },
];

export const TAREAS_INICIALES: Tarea[] = SEEDS.map((seed, index) => ({
  id: `t0000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  titulo: seed.titulo,
  descripcion: seed.descripcion ?? null,
  cliente_id: seed.cliente_id,
  responsable_id: RESPONSABLES_ROTACION[index % RESPONSABLES_ROTACION.length]!,
  fecha_vencimiento: diasDesdeHoy(seed.diasVencimiento),
  prioridad: seed.prioridad,
  estado: seed.estado,
  created_at: diasDesdeHoy(seed.diasVencimiento - 5),
}));
