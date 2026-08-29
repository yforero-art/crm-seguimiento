import type { EtapaOportunidad } from "@/types";

/**
 * Colores por etapa del Kanban. Son hex literales (no tokens HSL del sistema
 * de diseño) porque se usan como relleno sólido detrás de texto blanco en el
 * header de columna — un color vívido y fijo lee bien en cualquier tema, a
 * diferencia de una superficie neutra que sí necesita invertirse en oscuro.
 * Tres de los siete ya coinciden con tokens existentes (azul=primary,
 * verde=success, rojo=destructive); los otros cuatro son exclusivos del Pipeline.
 */
export interface EtapaPipelineConfig {
  value: EtapaOportunidad;
  label: string;
  color: string;
}

export const ETAPAS_PIPELINE: EtapaPipelineConfig[] = [
  { value: "prospecto", label: "Prospecto", color: "#0066CC" },
  { value: "primer_contacto", label: "Primer Contacto", color: "#06B6D4" },
  { value: "reunion", label: "Reunión", color: "#10B981" },
  { value: "propuesta", label: "Propuesta", color: "#FBBF24" },
  { value: "negociacion", label: "Negociación", color: "#F97316" },
  { value: "ganado", label: "Ganado", color: "#059669" },
  { value: "perdido", label: "Perdido", color: "#EF4444" },
];

const ETAPA_MAP = new Map(ETAPAS_PIPELINE.map((e) => [e.value, e]));

export function getEtapaConfig(etapa: EtapaOportunidad): EtapaPipelineConfig {
  return ETAPA_MAP.get(etapa) ?? ETAPAS_PIPELINE[0]!;
}
