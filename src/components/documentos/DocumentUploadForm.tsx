"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLIENTES_INICIALES } from "@/lib/mock/clientes";
import { documentoUploadSchema, type DocumentoUploadInput } from "@/lib/validations/documento.schema";

const TIPOS_ARCHIVO = [
  { value: "pdf", label: "PDF" },
  { value: "word", label: "Word" },
  { value: "excel", label: "Excel" },
  { value: "imagen", label: "Imagen" },
] as const;

interface DocumentUploadFormProps {
  onSubmit: (data: DocumentoUploadInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function DocumentUploadForm({ onSubmit, onCancel, isLoading }: DocumentUploadFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DocumentoUploadInput>({
    resolver: zodResolver(documentoUploadSchema),
    defaultValues: { tipo: "pdf" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        Arrastra un archivo aquí o completa los datos manualmente.
        <br />
        <span className="text-xs">(Sin almacenamiento conectado todavía — solo se registra la entrada.)</span>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nombre">Nombre del archivo *</Label>
        <Input id="nombre" placeholder="Contrato_Cliente_2026.pdf" {...register("nombre")} />
        {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tipo">Tipo de archivo *</Label>
          <Controller
            control={control}
            name="tipo"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_ARCHIVO.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

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
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Subiendo..." : "Subir"}
        </Button>
      </div>
    </form>
  );
}
