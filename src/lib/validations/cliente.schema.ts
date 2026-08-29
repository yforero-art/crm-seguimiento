import { z } from "zod";
import { origenClienteEnum, prioridadEnum, regimenTributarioEnum, sectorClienteEnum } from "@/lib/db/schema";
import { CIUDADES_COLOMBIA } from "@/lib/utils/constants";

// Nota: `estado` no forma parte de este schema — un cliente nuevo siempre
// arranca en "prospecto" (default de la base de datos); el estado cambia
// después desde el Pipeline (drag & drop), no desde este formulario.
export const clienteSchema = z.object({
  // Datos de contacto
  nombre_contacto: z.string().min(2, "El nombre de contacto es obligatorio").max(200),
  empresa: z.string().min(2, "La empresa es obligatoria").max(200),
  cargo: z.string().max(100).optional().or(z.literal("")),
  telefono: z.string().min(7, "Teléfono inválido").max(20).optional().or(z.literal("")),
  whatsapp: z.string().min(7, "WhatsApp inválido").max(20).optional().or(z.literal("")),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  ciudad: z.enum(CIUDADES_COLOMBIA).optional(),

  // Clasificación
  origen: z.enum(origenClienteEnum.enumValues).optional(),
  sector: z.enum(sectorClienteEnum.enumValues).optional(),
  responsable_id: z.string().uuid("Selecciona un responsable válido").optional(),
  prioridad: z.enum(prioridadEnum.enumValues).default("media"),

  // Información fiscal
  nit: z
    .string()
    .regex(/^\d{5,15}(-\d)?$/, "NIT inválido (ej. 900123456-7)")
    .optional()
    .or(z.literal("")),
  regimen_tributario: z.enum(regimenTributarioEnum.enumValues).optional(),
  revisor_fiscal: z.boolean().default(false),
  requiere_auditoria: z.boolean().default(false),

  // Notas
  observaciones: z.string().max(2000).optional().or(z.literal("")),
});

export type ClienteInput = z.infer<typeof clienteSchema>;

export const clienteUpdateSchema = clienteSchema.partial();
export type ClienteUpdateInput = z.infer<typeof clienteUpdateSchema>;
