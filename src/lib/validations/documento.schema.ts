import { z } from "zod";

// Solo metadata — todavía no hay Supabase Storage conectado (Fase 6), así que
// esto no sube un archivo real, solo registra la entrada en la lista.
export const documentoUploadSchema = z.object({
  nombre: z.string().min(3, "El nombre del archivo es obligatorio").max(200),
  tipo: z.enum(["pdf", "word", "excel", "imagen"], { errorMap: () => ({ message: "Selecciona un tipo de archivo" }) }),
  cliente_id: z.string().uuid("Selecciona un cliente válido").optional(),
});

export type DocumentoUploadInput = z.infer<typeof documentoUploadSchema>;
