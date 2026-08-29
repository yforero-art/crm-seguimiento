import {
  DollarSign,
  FileText,
  Handshake,
  Mail,
  MessageCircle,
  Paperclip,
  Phone,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import type {
  EstadoCliente,
  EstadoTarea,
  EtapaOportunidad,
  OrigenCliente,
  Prioridad,
  RegimenTributario,
  ResultadoSeguimiento,
  SectorCliente,
  TipoDocumento,
  TipoSeguimiento,
} from "@/types";

export type ColorToken = "azul" | "verde" | "rojo" | "gris" | "amarillo" | "naranja" | "morado";

// Mapa único de clases Tailwind por token de color — EstadoBadge, TimelineItem
// y cualquier otro componente que necesite pintar por "color semántico" leen
// de aquí, para no repetir la misma tabla de colores en cada componente.
export const COLOR_TOKEN_CLASSES: Record<
  ColorToken,
  { text: string; bg: string; solid: string; borderSubtle: string }
> = {
  azul: { text: "text-primary", bg: "bg-primary/10", solid: "bg-primary", borderSubtle: "border-primary/20" },
  verde: { text: "text-success", bg: "bg-success/10", solid: "bg-success", borderSubtle: "border-success/20" },
  rojo: {
    text: "text-destructive",
    bg: "bg-destructive/10",
    solid: "bg-destructive",
    borderSubtle: "border-destructive/20",
  },
  gris: { text: "text-muted-foreground", bg: "bg-muted", solid: "bg-muted-foreground/40", borderSubtle: "border-border" },
  amarillo: { text: "text-warning", bg: "bg-warning/10", solid: "bg-warning", borderSubtle: "border-warning/20" },
  naranja: { text: "text-orange", bg: "bg-orange/10", solid: "bg-orange", borderSubtle: "border-orange/20" },
  morado: { text: "text-purple", bg: "bg-purple/10", solid: "bg-purple", borderSubtle: "border-purple/20" },
};

export const ESTADOS_CLIENTE: Record<EstadoCliente, { label: string; color: ColorToken }> = {
  prospecto: { label: "Prospecto", color: "azul" },
  primer_contacto: { label: "Primer Contacto", color: "azul" },
  reunion: { label: "Reunión", color: "azul" },
  propuesta: { label: "Propuesta", color: "azul" },
  negociacion: { label: "Negociación", color: "azul" },
  cliente_activo: { label: "Cliente Activo", color: "verde" },
  perdido: { label: "Perdido", color: "rojo" },
};

export const ETAPAS_OPORTUNIDAD: Record<EtapaOportunidad, { label: string; color: ColorToken }> = {
  prospecto: { label: "Prospecto", color: "azul" },
  primer_contacto: { label: "Primer Contacto", color: "azul" },
  reunion: { label: "Reunión", color: "azul" },
  propuesta: { label: "Propuesta", color: "azul" },
  negociacion: { label: "Negociación", color: "azul" },
  ganado: { label: "Ganado", color: "verde" },
  perdido: { label: "Perdido", color: "rojo" },
};

export const PRIORIDADES: Record<Prioridad, { label: string; color: ColorToken }> = {
  baja: { label: "Baja", color: "gris" },
  media: { label: "Media", color: "amarillo" },
  alta: { label: "Alta", color: "rojo" },
};

export const TIPOS_SEGUIMIENTO: Record<TipoSeguimiento, { label: string; icon: LucideIcon; color: ColorToken }> = {
  llamada: { label: "Llamada", icon: Phone, color: "azul" },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "verde" },
  correo: { label: "Correo", icon: Mail, color: "naranja" },
  reunion: { label: "Reunión", icon: Handshake, color: "morado" },
  nota: { label: "Nota", icon: StickyNote, color: "gris" },
  cotizacion: { label: "Cotización", icon: DollarSign, color: "amarillo" },
  contrato: { label: "Contrato", icon: FileText, color: "rojo" },
  archivo: { label: "Archivo", icon: Paperclip, color: "gris" },
};

export const RESULTADOS_SEGUIMIENTO: Record<ResultadoSeguimiento, { label: string; color: ColorToken }> = {
  positivo: { label: "Positivo", color: "verde" },
  neutral: { label: "Neutral", color: "gris" },
  negativo: { label: "Negativo", color: "rojo" },
};

// Opciones rápidas para "¿Cuál es el próximo paso?" tras registrar un
// seguimiento — no es un enum de base de datos, alimenta directamente el
// título de la tarea que se crea automáticamente.
export const PROXIMOS_PASOS = [
  "Llamar",
  "Enviar Propuesta",
  "Enviar Contrato",
  "Correo",
  "WhatsApp",
  "Agendar",
  "Visita",
  "Esperar",
  "Otro",
] as const;

export const ESTADOS_TAREA: Record<EstadoTarea, { label: string; color: ColorToken }> = {
  pendiente: { label: "Pendiente", color: "azul" },
  en_progreso: { label: "En Progreso", color: "naranja" },
  completada: { label: "Completada", color: "verde" },
  cancelada: { label: "Cancelada", color: "rojo" },
};

export const TIPOS_DOCUMENTO: Record<TipoDocumento, { label: string }> = {
  cotizacion: { label: "Cotización" },
  contrato: { label: "Contrato" },
  factura: { label: "Factura" },
  propuesta: { label: "Propuesta" },
  acta: { label: "Acta" },
};

export const ORIGENES_CLIENTE: Record<OrigenCliente, { label: string }> = {
  referido: { label: "Referido" },
  linkedin: { label: "LinkedIn" },
  llamada_fria: { label: "Llamada Fría" },
  website: { label: "Website" },
  google: { label: "Google" },
};

export const SECTORES_CLIENTE: Record<SectorCliente, { label: string }> = {
  gastronomia: { label: "Gastronomía" },
  comercio: { label: "Comercio" },
  servicios: { label: "Servicios" },
  construccion: { label: "Construcción" },
  transporte: { label: "Transporte" },
};

export const REGIMENES_TRIBUTARIOS: Record<RegimenTributario, { label: string }> = {
  simple: { label: "Régimen Simple" },
  ordinario: { label: "Régimen Ordinario" },
  especial: { label: "Régimen Especial" },
};

// Lista curada de ciudades principales — el campo en base de datos es texto
// libre (no un enum de Postgres), para no requerir una migración cada vez que
// se necesite agregar una ciudad nueva.
export const CIUDADES_COLOMBIA = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Santa Marta",
  "Cúcuta",
  "Ibagué",
  "Villavicencio",
] as const;
