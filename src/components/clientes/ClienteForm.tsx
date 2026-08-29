"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RESPONSABLES_DEFAULT, type ResponsableOption } from "@/lib/mock/responsables";
import { CIUDADES_COLOMBIA, ORIGENES_CLIENTE, PRIORIDADES, REGIMENES_TRIBUTARIOS, SECTORES_CLIENTE } from "@/lib/utils/constants";
import { clienteSchema, type ClienteInput } from "@/lib/validations/cliente.schema";
import type { Cliente } from "@/types";

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (data: ClienteInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  responsables?: ResponsableOption[];
}

function toDefaultValues(cliente?: Cliente): Partial<ClienteInput> {
  if (!cliente) return { prioridad: "media", revisor_fiscal: false, requiere_auditoria: false };

  return {
    nombre_contacto: cliente.nombre_contacto,
    empresa: cliente.empresa,
    cargo: cliente.cargo ?? "",
    telefono: cliente.telefono ?? "",
    whatsapp: cliente.whatsapp ?? "",
    email: cliente.email ?? "",
    ciudad: (cliente.ciudad as ClienteInput["ciudad"]) ?? undefined,
    origen: cliente.origen ?? undefined,
    sector: cliente.sector ?? undefined,
    responsable_id: cliente.responsable_id ?? undefined,
    prioridad: cliente.prioridad,
    nit: cliente.nit ?? "",
    regimen_tributario: cliente.regimen_tributario ?? undefined,
    revisor_fiscal: cliente.revisor_fiscal,
    requiere_auditoria: cliente.requiere_auditoria,
    observaciones: cliente.observaciones ?? "",
  };
}

export function ClienteForm({ cliente, onSubmit, onCancel, isLoading, responsables = RESPONSABLES_DEFAULT }: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClienteInput>({
    resolver: zodResolver(clienteSchema),
    defaultValues: toDefaultValues(cliente),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Datos de contacto */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Datos de Contacto</legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nombre_contacto">Nombre completo *</Label>
            <Input id="nombre_contacto" {...register("nombre_contacto")} />
            {errors.nombre_contacto && <p className="text-sm text-destructive">{errors.nombre_contacto.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="empresa">Empresa *</Label>
            <Input id="empresa" {...register("empresa")} />
            {errors.empresa && <p className="text-sm text-destructive">{errors.empresa.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cargo">Cargo</Label>
            <Input id="cargo" {...register("cargo")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" {...register("telefono")} />
            {errors.telefono && <p className="text-sm text-destructive">{errors.telefono.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" {...register("whatsapp")} />
            {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Controller
              control={control}
              name="ciudad"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="ciudad">
                    <SelectValue placeholder="Selecciona una ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {CIUDADES_COLOMBIA.map((ciudad) => (
                      <SelectItem key={ciudad} value={ciudad}>
                        {ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </fieldset>

      {/* Clasificación */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Clasificación</legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="origen">Origen</Label>
            <Controller
              control={control}
              name="origen"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="origen">
                    <SelectValue placeholder="¿Cómo llegó?" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORIGENES_CLIENTE).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sector">Sector</Label>
            <Controller
              control={control}
              name="sector"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Sector económico" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SECTORES_CLIENTE).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="responsable_id">Responsable</Label>
            <Controller
              control={control}
              name="responsable_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="responsable_id">
                    <SelectValue placeholder="Asignar a" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsables.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Prioridad</Label>
            <Controller
              control={control}
              name="prioridad"
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-flow-col auto-cols-max gap-4 pt-2">
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
        </div>
      </fieldset>

      {/* Información fiscal */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Información Fiscal</legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nit">NIT</Label>
            <Input id="nit" placeholder="900123456-7" {...register("nit")} />
            {errors.nit && <p className="text-sm text-destructive">{errors.nit.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="regimen_tributario">Régimen Tributario</Label>
            <Controller
              control={control}
              name="regimen_tributario"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="regimen_tributario">
                    <SelectValue placeholder="Selecciona un régimen" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REGIMENES_TRIBUTARIOS).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="revisor_fiscal"
              render={({ field }) => (
                <Checkbox id="revisor_fiscal" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="revisor_fiscal" className="font-normal">
              Tiene revisor fiscal
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="requiere_auditoria"
              render={({ field }) => (
                <Checkbox id="requiere_auditoria" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="requiere_auditoria" className="font-normal">
              Requiere auditoría
            </Label>
          </div>
        </div>
      </fieldset>

      {/* Notas */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Notas</legend>
        <div className="space-y-1.5">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea id="observaciones" rows={4} {...register("observaciones")} />
        </div>
      </fieldset>

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
