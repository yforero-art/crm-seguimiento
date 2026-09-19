import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  accionLogEnum,
  actividadLog,
  clientes,
  documentos,
  estadoClienteEnum,
  estadoTareaEnum,
  etapaOportunidadEnum,
  mensajes,
  notificaciones,
  oportunidades,
  origenClienteEnum,
  prioridadEnum,
  regimenTributarioEnum,
  resultadoSeguimientoEnum,
  rolEnum,
  sectorClienteEnum,
  seguimientos,
  tareas,
  tipoDocumentoEnum,
  tipoNotificacionEnum,
  tipoSeguimientoEnum,
  users,
} from "@/lib/db/schema";

/**
 * Todos los tipos de este archivo se derivan directamente del schema de Drizzle
 * (fuente de verdad única). Nunca declares aquí un campo que no exista en
 * src/lib/db/schema.ts — edita el schema y estos tipos se actualizan solos.
 */

// ---------- Enums ----------
export type Rol = (typeof rolEnum.enumValues)[number];
export type EstadoCliente = (typeof estadoClienteEnum.enumValues)[number];
export type EtapaOportunidad = (typeof etapaOportunidadEnum.enumValues)[number];
export type Prioridad = (typeof prioridadEnum.enumValues)[number];
export type TipoSeguimiento = (typeof tipoSeguimientoEnum.enumValues)[number];
export type EstadoTarea = (typeof estadoTareaEnum.enumValues)[number];
export type TipoDocumento = (typeof tipoDocumentoEnum.enumValues)[number];
export type TipoNotificacion = (typeof tipoNotificacionEnum.enumValues)[number];
export type AccionLog = (typeof accionLogEnum.enumValues)[number];
export type OrigenCliente = (typeof origenClienteEnum.enumValues)[number];
export type SectorCliente = (typeof sectorClienteEnum.enumValues)[number];
export type RegimenTributario = (typeof regimenTributarioEnum.enumValues)[number];
export type ResultadoSeguimiento = (typeof resultadoSeguimientoEnum.enumValues)[number];

// ---------- Entidades ----------
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Cliente = InferSelectModel<typeof clientes>;
export type NewCliente = InferInsertModel<typeof clientes>;

export type Oportunidad = InferSelectModel<typeof oportunidades>;
export type NewOportunidad = InferInsertModel<typeof oportunidades>;

export type Seguimiento = InferSelectModel<typeof seguimientos>;
export type NewSeguimiento = InferInsertModel<typeof seguimientos>;

export type Tarea = InferSelectModel<typeof tareas>;
export type NewTarea = InferInsertModel<typeof tareas>;

export type Documento = InferSelectModel<typeof documentos>;
export type NewDocumento = InferInsertModel<typeof documentos>;

export type Notificacion = InferSelectModel<typeof notificaciones>;
export type NewNotificacion = InferInsertModel<typeof notificaciones>;

export type ActividadLog = InferSelectModel<typeof actividadLog>;

export type Mensaje = InferSelectModel<typeof mensajes>;
export type NewMensaje = InferInsertModel<typeof mensajes>;
