import { z } from "zod";
import { resultadoSeguimientoEnum, tipoSeguimientoEnum } from "@/lib/db/schema";

// Nota: `cliente_id` no forma parte de este schema — SeguimientoForm siempre
// se monta dentro de la página de un cliente específico, así que el
// componente padre adjunta cliente_id (y usuario_id) al construir el registro
// final, en vez de pedírselo al usuario en el formulario.
export const seguimientoSchema = z.object({
  tipo: z.enum(tipoSeguimientoEnum.enumValues, { errorMap: () => ({ message: "Selecciona un tipo de evento" }) }),
  descripcion: z.string().min(3, "Cuéntanos qué sucedió en esta interacción").max(2000),
  duracion_minutos: z.coerce.number().int().positive("La duración debe ser mayor a 0").optional(),
  resultado: z.enum(resultadoSeguimientoEnum.enumValues, { errorMap: () => ({ message: "Selecciona un resultado" }) }),
});

export type SeguimientoInput = z.infer<typeof seguimientoSchema>;
