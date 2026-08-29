import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  COLOR_TOKEN_CLASSES,
  ESTADOS_CLIENTE,
  ESTADOS_TAREA,
  ETAPAS_OPORTUNIDAD,
  PRIORIDADES,
  RESULTADOS_SEGUIMIENTO,
  type ColorToken,
} from "@/lib/utils/constants";

// Une los catálogos de estado (cliente, oportunidad, tarea, prioridad,
// resultado de seguimiento) en un solo mapa: los valores son strings únicos
// entre dominios, así que un componente genérico puede pintarlos todos sin
// necesitar un prop extra de "tipo de estado".
const ESTADO_MAP: Record<string, { label: string; color: ColorToken }> = {
  ...ESTADOS_CLIENTE,
  ...ETAPAS_OPORTUNIDAD,
  ...ESTADOS_TAREA,
  ...PRIORIDADES,
  ...RESULTADOS_SEGUIMIENTO,
};

const SIZE_STYLES: Record<"sm" | "md" | "lg", string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

interface EstadoBadgeProps {
  estado: string;
  tamano?: "sm" | "md" | "lg";
  className?: string;
}

export function EstadoBadge({ estado, tamano = "md", className }: EstadoBadgeProps) {
  const { label, color } = ESTADO_MAP[estado] ?? { label: estado, color: "gris" as const };
  const styles = COLOR_TOKEN_CLASSES[color];

  return (
    <Badge variant="outline" className={cn(styles.borderSubtle, styles.bg, styles.text, SIZE_STYLES[tamano], className)}>
      {label}
    </Badge>
  );
}
