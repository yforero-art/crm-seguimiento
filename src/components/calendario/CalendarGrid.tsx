import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import { CalendarEvent, type TipoEventoCalendario } from "@/components/calendario/CalendarEvent";
import { cn } from "@/lib/utils/cn";

export interface EventoCalendario {
  id: string;
  titulo: string;
  hora: string;
  tipo: TipoEventoCalendario;
  fecha: Date;
}

interface CalendarGridProps {
  mes: number; // 0-11
  anio: number;
  eventos: EventoCalendario[];
}

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MAX_EVENTOS_VISIBLES = 3;

export function CalendarGrid({ mes, anio, eventos }: CalendarGridProps) {
  const primerDiaMes = startOfMonth(new Date(anio, mes));
  const ultimoDiaMes = endOfMonth(primerDiaMes);
  const inicioGrilla = startOfWeek(primerDiaMes, { weekStartsOn: 1 });
  const finGrilla = endOfWeek(ultimoDiaMes, { weekStartsOn: 1 });
  const dias = eachDayOfInterval({ start: inicioGrilla, end: finGrilla });

  const eventosPorDia = new Map<string, EventoCalendario[]>();
  for (const evento of eventos) {
    const key = format(evento.fecha, "yyyy-MM-dd");
    const lista = eventosPorDia.get(key) ?? [];
    lista.push(evento);
    eventosPorDia.set(key, lista);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-7 bg-muted/60">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="border-b border-border p-2 text-center text-xs font-medium text-muted-foreground">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {dias.map((dia, index) => {
          const key = format(dia, "yyyy-MM-dd");
          const eventosDia = (eventosPorDia.get(key) ?? []).sort((a, b) => a.hora.localeCompare(b.hora));
          const enMes = isSameMonth(dia, primerDiaMes);
          const hoy = isToday(dia);
          const esUltimaColumna = (index + 1) % 7 === 0;
          const esUltimaFila = index >= dias.length - 7;

          return (
            <div
              key={key}
              className={cn(
                "min-h-[104px] border-border p-1.5 transition-colors",
                !esUltimaColumna && "border-r",
                !esUltimaFila && "border-b",
                !enMes && "bg-muted/30"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs tabular-nums",
                  hoy ? "bg-primary font-semibold text-primary-foreground" : enMes ? "text-foreground" : "text-muted-foreground/50"
                )}
              >
                {dia.getDate()}
              </span>

              <div className="mt-1 space-y-0.5">
                {eventosDia.slice(0, MAX_EVENTOS_VISIBLES).map((evento) => (
                  <CalendarEvent key={evento.id} titulo={evento.titulo} hora={evento.hora} tipo={evento.tipo} />
                ))}
                {eventosDia.length > MAX_EVENTOS_VISIBLES && (
                  <p className="px-1 text-[10px] text-muted-foreground">+{eventosDia.length - MAX_EVENTOS_VISIBLES} más</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
