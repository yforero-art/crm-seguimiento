import { z } from "zod";
import { etapaOportunidadEnum } from "@/lib/db/schema";

// Schema reducido específico del Kanban: a diferencia de `oportunidadSchema`
// (que exige cliente_id porque nace de la ficha de un cliente), este formulario
// de alta rápida trabaja con empresa/contacto en texto libre — coherente con
// KanbanOportunidad, el view-model ya desnormalizado que usan las tarjetas.
export const kanbanOportunidadSchema = z.object({
  titulo: z.string().min(2, "El nombre de contacto es obligatorio").max(200),
  empresa: z.string().min(2, "La empresa es obligatoria").max(200),
  valor: z.coerce.number().positive("El valor debe ser mayor a 0"),
  probabilidad: z.coerce
    .number()
    .int("La probabilidad debe ser un número entero")
    .min(0, "La probabilidad mínima es 0%")
    .max(100, "La probabilidad máxima es 100%"),
  responsable: z.string().min(1, "Selecciona un responsable"),
  etapa: z.enum(etapaOportunidadEnum.enumValues).default("prospecto"),
});

export type KanbanOportunidadInput = z.infer<typeof kanbanOportunidadSchema>;
