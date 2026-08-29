import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type ReportColor = "blue" | "green" | "red" | "gray";

const COLOR_STYLES: Record<ReportColor, string> = {
  blue: "bg-primary/10 text-primary",
  green: "bg-success/10 text-success",
  red: "bg-destructive/10 text-destructive",
  gray: "bg-muted text-muted-foreground",
};

interface ReportCardProps {
  titulo: string;
  valor: string | number;
  cambio?: number;
  icono: ReactNode;
  color?: ReportColor;
}

// Deliberadamente distinto de StatCard (icono arriba del valor, no al lado)
// para que los Reportes tengan una jerarquía visual propia — StatCard es del
// Dashboard/Pipeline/Tareas, ReportCard es la variante de esta sección.
export function ReportCard({ titulo, valor, cambio, icono, color = "blue" }: ReportCardProps) {
  const hasCambio = cambio !== undefined;
  const esPositivo = hasCambio && cambio >= 0;

  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="space-y-3 p-6">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", COLOR_STYLES[color])}>{icono}</div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
          <p className="text-3xl font-bold tabular-nums text-foreground">{valor}</p>
        </div>
        {hasCambio && (
          <p className={cn("text-xs font-medium", esPositivo ? "text-success" : "text-destructive")}>
            {esPositivo ? "+" : ""}
            {cambio}%<span className="ml-1 font-normal text-muted-foreground">vs. mes anterior</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
