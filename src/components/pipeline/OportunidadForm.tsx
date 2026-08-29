"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { KanbanOportunidad } from "@/components/pipeline/KanbanCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RESPONSABLES_DEFAULT } from "@/lib/mock/responsables";
import { ETAPAS_PIPELINE } from "@/lib/utils/pipeline";
import { kanbanOportunidadSchema, type KanbanOportunidadInput } from "@/lib/validations/kanbanOportunidad.schema";

interface OportunidadFormProps {
  oportunidad?: KanbanOportunidad;
  onSubmit: (data: KanbanOportunidadInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function OportunidadForm({ oportunidad, onSubmit, onCancel, isLoading }: OportunidadFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<KanbanOportunidadInput>({
    resolver: zodResolver(kanbanOportunidadSchema),
    defaultValues: oportunidad
      ? {
          titulo: oportunidad.titulo,
          empresa: oportunidad.empresa,
          valor: oportunidad.valor,
          probabilidad: oportunidad.probabilidad,
          responsable: oportunidad.responsable,
          etapa: oportunidad.etapa,
        }
      : { etapa: "prospecto", probabilidad: 10 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="titulo">Nombre de contacto *</Label>
          <Input id="titulo" {...register("titulo")} />
          {errors.titulo && <p className="text-sm text-destructive">{errors.titulo.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="empresa">Empresa *</Label>
          <Input id="empresa" {...register("empresa")} />
          {errors.empresa && <p className="text-sm text-destructive">{errors.empresa.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="valor">Valor estimado (COP) *</Label>
          <Input id="valor" type="number" min={0} step={10000} {...register("valor")} />
          {errors.valor && <p className="text-sm text-destructive">{errors.valor.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="probabilidad">Probabilidad (%) *</Label>
          <Input id="probabilidad" type="number" min={0} max={100} {...register("probabilidad")} />
          {errors.probabilidad && <p className="text-sm text-destructive">{errors.probabilidad.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="responsable">Responsable *</Label>
          <Controller
            control={control}
            name="responsable"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="responsable">
                  <SelectValue placeholder="Asignar a" />
                </SelectTrigger>
                <SelectContent>
                  {RESPONSABLES_DEFAULT.map((r) => (
                    <SelectItem key={r.id} value={r.nombre}>
                      {r.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.responsable && <p className="text-sm text-destructive">{errors.responsable.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="etapa">Etapa *</Label>
          <Controller
            control={control}
            name="etapa"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="etapa">
                  <SelectValue placeholder="Selecciona una etapa" />
                </SelectTrigger>
                <SelectContent>
                  {ETAPAS_PIPELINE.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
