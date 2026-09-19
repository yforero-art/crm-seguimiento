import { z } from "zod";

export const mensajeSchema = z.object({
  usuario_id: z.string().uuid("Usuario inválido"),
  contenido: z.string().min(1, "Escribe algo antes de enviar").max(2000, "El mensaje es demasiado largo"),
});

export type MensajeInput = z.infer<typeof mensajeSchema>;
