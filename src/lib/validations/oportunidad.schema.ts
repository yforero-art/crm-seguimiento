import { z } from "zod";
import { etapaOportunidadEnum } from "@/lib/db/schema";

export const oportunidadSchema = z.object({
  cliente_id: z.string().uuid("Selecciona un cliente válido"),
  nombre: z.string().min(2, "El nombre de la oportunidad es obligatorio").max(200),
  valor_estimado: z.coerce.number().positive("El valor estimado debe ser mayor a 0"),
  probabilidad: z.coerce
    .number()
    .int("La probabilidad debe ser un número entero")
    .min(0, "La probabilidad mínima es 0%")
    .max(100, "La probabilidad máxima es 100%"),
  etapa: z.enum(etapaOportunidadEnum.enumValues).default("prospecto"),
  responsable_id: z.string().uuid("Selecciona un responsable válido").optional(),
});

export type OportunidadInput = z.infer<typeof oportunidadSchema>;

export const oportunidadUpdateSchema = oportunidadSchema.partial();
export type OportunidadUpdateInput = z.infer<typeof oportunidadUpdateSchema>;
