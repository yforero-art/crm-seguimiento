"use client";

import { DollarSign, Percent, Plus, Target, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import type { KanbanOportunidad } from "@/components/pipeline/KanbanCard";
import { OportunidadForm } from "@/components/pipeline/OportunidadForm";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OPORTUNIDADES_INICIALES } from "@/lib/mock/oportunidades";
import { formatCurrencyCompact } from "@/lib/utils/format";
import { ETAPAS_PIPELINE } from "@/lib/utils/pipeline";
import type { KanbanOportunidadInput } from "@/lib/validations/kanbanOportunidad.schema";
import type { EtapaOportunidad } from "@/types";

const ETAPAS_CERRADAS: EtapaOportunidad[] = ["ganado", "perdido"];

export default function PipelinePage() {
  const [oportunidades, setOportunidades] = useState<KanbanOportunidad[]>(OPORTUNIDADES_INICIALES);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [oportunidadEditando, setOportunidadEditando] = useState<KanbanOportunidad | null>(null);

  const columnas = useMemo(
    () =>
      ETAPAS_PIPELINE.map((config) => ({
        etapa: config.value,
        label: config.label,
        color: config.color,
        oportunidades: oportunidades.filter((o) => o.etapa === config.value),
      })),
    [oportunidades]
  );

  const stats = useMemo(() => {
    const activas = oportunidades.filter((o) => !ETAPAS_CERRADAS.includes(o.etapa));
    const ganadas = oportunidades.filter((o) => o.etapa === "ganado").length;
    const perdidas = oportunidades.filter((o) => o.etapa === "perdido").length;
    const totalCerradas = ganadas + perdidas;

    return {
      valorTotal: activas.reduce((sum, o) => sum + o.valor, 0),
      oportunidadesActivas: activas.length,
      tasaConversion: totalCerradas > 0 ? Math.round((ganadas / totalCerradas) * 100) : 0,
      probabilidadPromedio: activas.length > 0 ? Math.round(activas.reduce((sum, o) => sum + o.probabilidad, 0) / activas.length) : 0,
    };
  }, [oportunidades]);

  function handleUpdateEtapa(id: string, nuevaEtapa: EtapaOportunidad) {
    // TODO(Fase 4): reemplazar por updateOportunidadEtapa() (Server Action).
    setOportunidades((prev) => prev.map((o) => (o.id === id ? { ...o, etapa: nuevaEtapa } : o)));
  }

  function handleNueva() {
    setOportunidadEditando(null);
    setDialogAbierto(true);
  }

  function handleEdit(id: string) {
    setOportunidadEditando(oportunidades.find((o) => o.id === id) ?? null);
    setDialogAbierto(true);
  }

  function handleDuplicate(id: string) {
    const original = oportunidades.find((o) => o.id === id);
    if (!original) return;
    const copia: KanbanOportunidad = { ...original, id: crypto.randomUUID(), titulo: `${original.titulo} (copia)` };
    setOportunidades((prev) => {
      const index = prev.findIndex((o) => o.id === id);
      return [...prev.slice(0, index + 1), copia, ...prev.slice(index + 1)];
    });
  }

  function handleSubmit(data: KanbanOportunidadInput) {
    // TODO(Fase 4): reemplazar por createOportunidad()/updateOportunidad() (Server Actions).
    if (oportunidadEditando) {
      setOportunidades((prev) => prev.map((o) => (o.id === oportunidadEditando.id ? { ...o, ...data } : o)));
    } else {
      setOportunidades((prev) => [...prev, { ...data, id: crypto.randomUUID(), moneda: "COP" }]);
    }
    setDialogAbierto(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Pipeline Comercial</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Valor Total Pipeline" value={formatCurrencyCompact(stats.valorTotal)} icon={<DollarSign className="h-5 w-5" />} color="blue" />
        <StatCard title="Oportunidades Activas" value={stats.oportunidadesActivas} icon={<TrendingUp className="h-5 w-5" />} color="blue" />
        <StatCard title="Tasa Conversión" value={`${stats.tasaConversion}%`} icon={<Percent className="h-5 w-5" />} color="green" />
        <StatCard title="Probabilidad Promedio" value={`${stats.probabilidadPromedio}%`} icon={<Target className="h-5 w-5" />} color="gray" />
      </div>

      <KanbanBoard columnas={columnas} onUpdateEtapa={handleUpdateEtapa} onEdit={handleEdit} onDuplicate={handleDuplicate} />

      <Button
        onClick={handleNueva}
        size="lg"
        className="fixed bottom-6 right-6 z-40 rounded-full bg-success text-success-foreground shadow-lg hover:bg-success/90"
      >
        <Plus className="h-5 w-5" />
        Nueva Oportunidad
      </Button>

      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{oportunidadEditando ? "Editar Oportunidad" : "Nueva Oportunidad"}</DialogTitle>
          </DialogHeader>
          <OportunidadForm oportunidad={oportunidadEditando ?? undefined} onSubmit={handleSubmit} onCancel={() => setDialogAbierto(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
