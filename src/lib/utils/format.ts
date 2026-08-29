import { format as formatDateFn, formatDistanceToNowStrict, isToday, isTomorrow, isYesterday } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "America/Bogota";

export function formatCurrency(valor: number, moneda: "COP" | "USD" = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

// Notación compacta "$800K" / "$2.4M" — la abreviación 'compact' de Intl en
// es-CO produce "mil"/"M" (locale-dependiente, no siempre K/M), así que para
// las tarjetas del Kanban se arma a mano el formato exacto que pide el diseño.
export function formatCurrencyCompact(valor: number, moneda: "COP" | "USD" = "COP"): string {
  const simbolo = moneda === "USD" ? "US$" : "$";
  const abs = Math.abs(valor);

  let cuerpo: string;
  if (abs >= 1_000_000) {
    cuerpo = `${(valor / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  } else if (abs >= 1_000) {
    cuerpo = `${Math.round(valor / 1_000)}K`;
  } else {
    cuerpo = `${valor}`;
  }

  return `${simbolo}${cuerpo} ${moneda}`;
}

export function formatDate(fecha: Date | string, pattern = "d 'de' MMMM 'de' yyyy"): string {
  const date = typeof fecha === "string" ? new Date(fecha) : fecha;
  const zoned = toZonedTime(date, TIMEZONE);
  return formatDateFn(zoned, pattern, { locale: es });
}

export function formatDateTime(fecha: Date | string): string {
  return formatDate(fecha, "d MMM yyyy, h:mm a");
}

// "Hoy" / "Mañana" / "Ayer" / "Hace 2 días" / "En 3 días" — el vocabulario
// exacto que pide el diseño de TaskCard, discreto para los próximos días y
// relativo (date-fns) para el resto.
export function formatFechaTarea(fecha: Date): string {
  if (isToday(fecha)) return "Hoy";
  if (isTomorrow(fecha)) return "Mañana";
  if (isYesterday(fecha)) return "Ayer";

  const relativo = formatDistanceToNowStrict(fecha, { addSuffix: true, locale: es });
  return relativo.charAt(0).toUpperCase() + relativo.slice(1);
}

export function formatPhone(telefono: string): string {
  const digits = telefono.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return telefono;
}

// Construye una fecha a mediodía en hora LOCAL — evita el bug clásico de
// `new Date("2026-08-25")` (medianoche UTC, se corre un día al mostrarla en
// America/Bogota). Usar esto en vez de parsear strings "YYYY-MM-DD" a mano.
export function fechaLocal(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
