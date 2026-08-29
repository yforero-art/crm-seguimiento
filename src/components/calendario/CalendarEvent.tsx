import { cn } from "@/lib/utils/cn";
import { COLOR_TOKEN_CLASSES, type ColorToken } from "@/lib/utils/constants";

// El spec de props solo lista reunión/llamada/tarea, pero los datos ficticios
// piden un 4º tipo "Entrega" (rojo) — se agrega aquí para que ambos calcen.
export type TipoEventoCalendario = "reunion" | "llamada" | "tarea" | "entrega";

const COLOR_POR_TIPO: Record<TipoEventoCalendario, ColorToken> = {
  reunion: "verde",
  llamada: "azul",
  tarea: "naranja",
  entrega: "rojo",
};

interface CalendarEventProps {
  titulo: string;
  hora: string;
  tipo: TipoEventoCalendario;
  color?: ColorToken;
  className?: string;
}

export function CalendarEvent({ titulo, hora, tipo, color, className }: CalendarEventProps) {
  const styles = COLOR_TOKEN_CLASSES[color ?? COLOR_POR_TIPO[tipo]];

  return (
    <div
      className={cn("truncate rounded px-1.5 py-0.5 text-[11px] font-medium leading-tight", styles.bg, styles.text, className)}
      title={`${hora} · ${titulo}`}
    >
      <span className="font-semibold tabular-nums">{hora}</span> {titulo}
    </div>
  );
}
