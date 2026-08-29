"use client";

import { format, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { DollarSign, Percent, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
import { ChartComponent } from "@/components/reportes/ChartComponent";
import { ReportCard } from "@/components/reportes/ReportCard";
import { OPORTUNIDADES_INICIALES } from "@/lib/mock/oportunidades";
import { formatCurrencyCompact } from "@/lib/utils/format";
import { ETAPAS_PIPELINE } from "@/lib/utils/pipeline";

// Tasa de conversión mensual ficticia, tendiendo hacia el 28% actual.
const CONVERSION_ULTIMOS_MESES = [19, 22, 21, 24, 26, 28];

export default function ReportesPage() {
  const pipelinePorEtapa = useMemo(
    () =>
      ETAPAS_PIPELINE.map((config) => ({
        label: config.label,
        value: OPORTUNIDADES_INICIALES.filter((o) => o.etapa === config.value).reduce((sum, o) => sum + o.valor, 0),
      })),
    []
  );

  const conversionesUltimos6Meses = useMemo(
    () =>
      CONVERSION_ULTIMOS_MESES.map((valor, index) => {
        const fecha = subMonths(new Date(), CONVERSION_ULTIMOS_MESES.length - 1 - index);
        const label = format(fecha, "MMM", { locale: es });
        return { label: label.charAt(0).toUpperCase() + label.slice(1), value: valor };
      }),
    []
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Reportes</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportCard titulo="Ingresos Totales" valor="$45.2M" cambio={12} icono={<DollarSign className="h-5 w-5" />} color="blue" />
        <ReportCard titulo="Tasa Conversión" valor="28%" cambio={2} icono={<Percent className="h-5 w-5" />} color="green" />
        <ReportCard titulo="Pipeline Activo" valor="$27.2M" cambio={-5} icono={<TrendingUp className="h-5 w-5" />} color="blue" />
        <ReportCard titulo="Clientes Nuevos" valor={16} cambio={8} icono={<Users className="h-5 w-5" />} color="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartComponent
          titulo="Pipeline por Etapa"
          data={pipelinePorEtapa}
          tipo="barras"
          formatValue={(v) => formatCurrencyCompact(v).replace(" COP", "")}
        />
        <ChartComponent titulo="Conversiones — Últimos 6 Meses" data={conversionesUltimos6Meses} tipo="linea" formatValue={(v) => `${v}%`} />
      </div>
    </div>
  );
}
