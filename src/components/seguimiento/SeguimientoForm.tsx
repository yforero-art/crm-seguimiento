"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import { COLOR_TOKEN_CLASSES, RESULTADOS_SEGUIMIENTO, TIPOS_SEGUIMIENTO } from "@/lib/utils/constants";
import { seguimientoSchema, type SeguimientoInput } from "@/lib/validations/seguimiento.schema";

const TIPOS_CON_DURACION = new Set(["llamada", "reunion"]);

interface SeguimientoFormProps {
  seguimiento?: Partial<SeguimientoInput>;
  onSubmit: (data: SeguimientoInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function SeguimientoForm({ seguimiento, onSubmit, onCancel, isLoading }: SeguimientoFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SeguimientoInput>({
    resolver: zodResolver(seguimientoSchema),
    defaultValues: seguimiento,
  });

  const tipoSeleccionado = watch("tipo");
  const muestraDuracion = tipoSeleccionado && TIPOS_CON_DURACION.has(tipoSeleccionado);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Tipo de evento */}
      <div className="space-y-2">
        <Label>Tipo de Evento *</Label>
        <Controller
          control={control}
          name="tipo"
          render={({ field }) => (
            <div role="radiogroup" aria-label="Tipo de evento" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.entries(TIPOS_SEGUIMIENTO).map(([value, { label, icon: Icon, color }]) => {
                const active = field.value === value;
                const styles = COLOR_TOKEN_CLASSES[color];
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-colors",
                      active ? cn(styles.borderSubtle, styles.bg, styles.text) : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.tipo && <p className="text-sm text-destructive">{errors.tipo.message}</p>}
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <Label htmlFor="descripcion">Descripción *</Label>
        <Textarea
          id="descripcion"
          rows={3}
          placeholder="Llamada de 20 min sobre presupuesto anual..."
          {...register("descripcion")}
        />
        <p className="text-xs text-muted-foreground">¿Qué sucedió en esta interacción?</p>
        {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion.message}</p>}
      </div>

      {/* Duración (condicional) */}
      {muestraDuracion && (
        <div className="max-w-[180px] space-y-1.5">
          <Label htmlFor="duracion_minutos">Duración (minutos)</Label>
          <Input id="duracion_minutos" type="number" min={1} placeholder="20" {...register("duracion_minutos")} />
          {errors.duracion_minutos && <p className="text-sm text-destructive">{errors.duracion_minutos.message}</p>}
        </div>
      )}

      {/* Resultado */}
      <div className="space-y-2">
        <Label>Resultado *</Label>
        <Controller
          control={control}
          name="resultado"
          render={({ field }) => (
            <div role="radiogroup" aria-label="Resultado" className="flex flex-wrap gap-2">
              {Object.entries(RESULTADOS_SEGUIMIENTO).map(([value, { label, color }]) => {
                const active = field.value === value;
                const styles = COLOR_TOKEN_CLASSES[color];
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(value)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      active ? cn(styles.borderSubtle, styles.bg, styles.text) : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.resultado && <p className="text-sm text-destructive">{errors.resultado.message}</p>}
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
