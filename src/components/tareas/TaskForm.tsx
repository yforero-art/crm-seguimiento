"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CLIENTES_INICIALES } from "@/lib/mock/clientes";
import { RESPONSABLES_DEFAULT } from "@/lib/mock/responsables";
import { ESTADOS_TAREA, PRIORIDADES } from "@/lib/utils/constants";
import { tareaSchema, type TareaInput } from "@/lib/validations/tarea.schema";
import type { Tarea } from "@/types";

interface TaskFormProps {
  tarea?: Tarea;
  onSubmit: (data: TareaInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// El <input type="date"> nativo entrega/espera "YYYY-MM-DD". Si ese string se
// dejara pasar tal cual a z.coerce.date(), `new Date("2026-08-25")` se
// interpreta como medianoche UTC — en Bogotá (UTC-5) eso muestra el día
// anterior. Se ancla a mediodía en hora local en ambas direcciones.
function fechaAInputValue(fecha?: Date): string {
  if (!fecha) return "";
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function inputValueAFecha(value: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d, 12, 0, 0);
}

function toDefaultValues(tarea?: Tarea): Partial<TareaInput> {
  if (!tarea) return { prioridad: "media", estado: "pendiente" };

  return {
    titulo: tarea.titulo,
    descripcion: tarea.descripcion ?? "",
    cliente_id: tarea.cliente_id ?? undefined,
    responsable_id: tarea.responsable_id,
    fecha_vencimiento: tarea.fecha_vencimiento,
    prioridad: tarea.prioridad,
    estado: tarea.estado,
  };
}

export function TaskForm({ tarea, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TareaInput>({
    resolver: zodResolver(tareaSchema),
    defaultValues: toDefaultValues(tarea),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="titulo">Título *</Label>
        <Input id="titulo" {...register("titulo")} />
        {errors.titulo && <p className="text-sm text-destructive">{errors.titulo.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" rows={3} {...register("descripcion")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cliente_id">Cliente</Label>
          <Controller
            control={control}
            name="cliente_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="cliente_id">
                  <SelectValue placeholder="Sin cliente asociado" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENTES_INICIALES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.empresa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="responsable_id">Responsable *</Label>
          <Controller
            control={control}
            name="responsable_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="responsable_id">
                  <SelectValue placeholder="Asignar a" />
                </SelectTrigger>
                <SelectContent>
                  {RESPONSABLES_DEFAULT.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.responsable_id && <p className="text-sm text-destructive">{errors.responsable_id.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fecha_vencimiento">Fecha de vencimiento *</Label>
          <Controller
            control={control}
            name="fecha_vencimiento"
            render={({ field }) => (
              <Input
                id="fecha_vencimiento"
                type="date"
                value={fechaAInputValue(field.value)}
                onChange={(e) => field.onChange(inputValueAFecha(e.target.value))}
              />
            )}
          />
          {errors.fecha_vencimiento && <p className="text-sm text-destructive">{errors.fecha_vencimiento.message}</p>}
        </div>

        {tarea && (
          <div className="space-y-1.5">
            <Label htmlFor="estado">Estado</Label>
            <Controller
              control={control}
              name="estado"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="estado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ESTADOS_TAREA).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Prioridad</Label>
        <Controller
          control={control}
          name="prioridad"
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-flow-col auto-cols-max gap-4">
              {Object.entries(PRIORIDADES).map(([value, { label }]) => (
                <div key={value} className="flex items-center gap-2">
                  <RadioGroupItem value={value} id={`prioridad-${value}`} />
                  <Label htmlFor={`prioridad-${value}`} className="font-normal">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
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
