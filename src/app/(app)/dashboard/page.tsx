import { AlertCircle, Calendar, Mail, Phone, Target, TrendingUp, Users } from "lucide-react";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TODO(Fase 3): reemplazar por datos reales vía Server Actions (getClientes,
// reportes de pipeline, seguimientos recientes). Todo lo de abajo es ficticio.

const PIPELINE_DATA = [
  { etapa: "Prospecto", valor: 12 },
  { etapa: "Primer Contacto", valor: 8 },
  { etapa: "Reunión", valor: 6 },
  { etapa: "Propuesta", valor: 4 },
  { etapa: "Negociación", valor: 2 },
  { etapa: "Ganado", valor: 1 },
];

const ACTIVIDAD_RECIENTE = [
  { icon: Phone, descripcion: "Llamada a Alpha Ambulancias", tiempo: "hace 2h" },
  { icon: Mail, descripcion: "Correo a La Spaghettata", tiempo: "hace 4h" },
  { icon: Calendar, descripcion: "Reunión con X-Data Colombia", tiempo: "hace 1d" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Clientes Activos" value={48} icon={<Users className="h-5 w-5" />} color="blue" trend={12} />
        <StatCard title="Prospectos Nuevos" value={16} icon={<Target className="h-5 w-5" />} color="green" trend={5} />
        <StatCard title="Valor Pipeline" value="$2.4M" icon={<TrendingUp className="h-5 w-5" />} color="blue" trend={8} />
        <StatCard title="Tareas Vencidas" value={3} icon={<AlertCircle className="h-5 w-5" />} color="red" trend={-2} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <PipelineChart data={PIPELINE_DATA} />
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ACTIVIDAD_RECIENTE.map((item) => (
              <div key={item.descripcion} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="flex-1 truncate text-sm font-medium text-foreground">{item.descripcion}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{item.tiempo}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
