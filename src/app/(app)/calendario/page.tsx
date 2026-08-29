"use client";

import { endOfWeek, format, isWithinInterval, startOfDay, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { CalendarEvent } from "@/components/calendario/CalendarEvent";
import { CalendarGrid } from "@/components/calendario/CalendarGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENTOS_INICIALES } from "@/lib/mock/eventos";

// currentDate de la sesión es 2026-08-20 — agosto 2026 es literalmente "hoy".
const MES_INICIAL = 7; // agosto, 0-indexado
const ANIO_INICIAL = 2026;

export default function CalendarioPage() {
  const [mes, setMes] = useState(MES_INICIAL);
  const [anio, setAnio] = useState(ANIO_INICIAL);

  function mesAnterior() {
    if (mes === 0) {
      setMes(11);
      setAnio((a) => a - 1);
    } else {
      setMes((m) => m - 1);
    }
  }

  function mesSiguiente() {
    if (mes === 11) {
      setMes(0);
      setAnio((a) => a + 1);
    } else {
      setMes((m) => m + 1);
    }
  }

  const tituloMes = useMemo(() => {
    const label = format(new Date(anio, mes), "MMMM yyyy", { locale: es });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [mes, anio]);

  const proximosEstaSemana = useMemo(() => {
    const hoy = startOfDay(new Date());
    const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 });
    const finSemana = endOfWeek(hoy, { weekStartsOn: 1 });

    return EVENTOS_INICIALES.filter((e) => e.fecha >= hoy && isWithinInterval(e.fecha, { start: inicioSemana, end: finSemana })).sort(
      (a, b) => a.fecha.getTime() - b.fecha.getTime() || a.hora.localeCompare(b.hora)
    );
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Calendario</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{tituloMes}</h2>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={mesAnterior} aria-label="Mes anterior">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={mesSiguiente} aria-label="Mes siguiente">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CalendarGrid mes={mes} anio={anio} eventos={EVENTOS_INICIALES} />
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Próximos esta semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proximosEstaSemana.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay eventos programados esta semana.</p>
            ) : (
              proximosEstaSemana.map((evento) => (
                <div key={evento.id} className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {format(evento.fecha, "EEEE d", { locale: es }).replace(/^\w/, (c) => c.toUpperCase())}
                  </p>
                  <CalendarEvent titulo={evento.titulo} hora={evento.hora} tipo={evento.tipo} className="w-full" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
