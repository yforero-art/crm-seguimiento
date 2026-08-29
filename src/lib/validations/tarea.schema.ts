import { z } from "zod";
import { estadoTareaEnum, prioridadEnum } from "@/lib/db/schema";

export const tareaSchema = z.object({
  titulo: z.string().min(2, "El título es obligatorio").max(200),
  descripcion: z.string().max(2000).optional().or(z.literal("")),
  cliente_id: z.string().uuid("Selecciona un cliente válido").optional(),
  responsable_id: z.string().uuid("Selecciona un responsable válido"),
  fecha_vencimiento: z.coerce.date({ errorMap: () => ({ message: "Fecha de vencimiento inválida" }) }),
  prioridad: z.enum(prioridadEnum.enumValues).default("media"),
  estado: z.enum(estadoTareaEnum.enumValues).default("pendiente"),
});

export type TareaInput = z.infer<typeof tareaSchema>;

export const tareaUpdateSchema = tareaSchema.partial();
export type TareaUpdateInput = z.infer<typeof tareaUpdateSchema>;
