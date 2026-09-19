import { relations, sql } from "drizzle-orm";
import { boolean, check, index, integer, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ============================================================
// Enums
// ============================================================

export const rolEnum = pgEnum("rol", ["admin", "auxiliar"]);

export const estadoClienteEnum = pgEnum("estado_cliente", [
  "prospecto",
  "primer_contacto",
  "reunion",
  "propuesta",
  "negociacion",
  "cliente_activo",
  "perdido",
]);

export const etapaOportunidadEnum = pgEnum("etapa_oportunidad", [
  "prospecto",
  "primer_contacto",
  "reunion",
  "propuesta",
  "negociacion",
  "ganado",
  "perdido",
]);

export const prioridadEnum = pgEnum("prioridad", ["baja", "media", "alta"]);

export const tipoSeguimientoEnum = pgEnum("tipo_seguimiento", [
  "llamada",
  "whatsapp",
  "correo",
  "reunion",
  "nota",
  "cotizacion",
  "contrato",
  "archivo",
]);

export const resultadoSeguimientoEnum = pgEnum("resultado_seguimiento", ["positivo", "neutral", "negativo"]);

export const estadoTareaEnum = pgEnum("estado_tarea", ["pendiente", "en_progreso", "completada", "cancelada"]);

export const tipoDocumentoEnum = pgEnum("tipo_documento", ["cotizacion", "contrato", "factura", "propuesta", "acta"]);

export const tipoNotificacionEnum = pgEnum("tipo_notificacion", [
  "tarea_vencida",
  "reunion_hoy",
  "asignacion",
  "mencion",
]);

export const accionLogEnum = pgEnum("accion_log", ["crear", "editar", "eliminar", "cambio_estado"]);

export const origenClienteEnum = pgEnum("origen_cliente", [
  "referido",
  "linkedin",
  "llamada_fria",
  "website",
  "google",
]);

export const sectorClienteEnum = pgEnum("sector_cliente", [
  "gastronomia",
  "comercio",
  "servicios",
  "construccion",
  "transporte",
]);

export const regimenTributarioEnum = pgEnum("regimen_tributario", ["simple", "ordinario", "especial"]);

// ============================================================
// Tablas
// ============================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // = auth.users.id de Supabase
  email: text("email").notNull().unique(),
  nombre: text("nombre").notNull(),
  rol: rolEnum("rol").notNull().default("auxiliar"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clientes = pgTable(
  "clientes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    empresa: text("empresa").notNull(),
    nombre_contacto: text("nombre_contacto").notNull(),
    cargo: text("cargo"),
    email: text("email"),
    telefono: text("telefono"),
    whatsapp: text("whatsapp"),
    ciudad: text("ciudad"),
    nit: text("nit"),
    estado: estadoClienteEnum("estado").notNull().default("prospecto"),
    prioridad: prioridadEnum("prioridad").notNull().default("media"),
    origen: origenClienteEnum("origen"),
    sector: sectorClienteEnum("sector"),
    regimen_tributario: regimenTributarioEnum("regimen_tributario"),
    revisor_fiscal: boolean("revisor_fiscal").notNull().default(false),
    requiere_auditoria: boolean("requiere_auditoria").notNull().default(false),
    observaciones: text("observaciones"),
    responsable_id: uuid("responsable_id").references(() => users.id, { onDelete: "set null" }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    responsableIdx: index("idx_clientes_responsable").on(table.responsable_id),
    estadoIdx: index("idx_clientes_estado").on(table.estado),
  })
);

export const oportunidades = pgTable(
  "oportunidades",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cliente_id: uuid("cliente_id")
      .notNull()
      .references(() => clientes.id, { onDelete: "cascade" }),
    nombre: text("nombre").notNull(),
    valor_estimado: numeric("valor_estimado", { precision: 14, scale: 2 }).notNull(),
    probabilidad: integer("probabilidad").notNull(),
    // Columna generada por Postgres — nunca se calcula en la aplicación.
    valor_esperado: numeric("valor_esperado", { precision: 14, scale: 2 }).generatedAlwaysAs(
      sql`(valor_estimado * probabilidad / 100)`
    ),
    etapa: etapaOportunidadEnum("etapa").notNull().default("prospecto"),
    responsable_id: uuid("responsable_id").references(() => users.id, { onDelete: "set null" }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    clienteIdx: index("idx_oportunidades_cliente").on(table.cliente_id),
    etapaIdx: index("idx_oportunidades_etapa").on(table.etapa),
    responsableIdx: index("idx_oportunidades_responsable").on(table.responsable_id),
    probabilidadRangeCheck: check(
      "probabilidad_range",
      sql`${table.probabilidad} >= 0 AND ${table.probabilidad} <= 100`
    ),
  })
);

export const seguimientos = pgTable(
  "seguimientos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cliente_id: uuid("cliente_id")
      .notNull()
      .references(() => clientes.id, { onDelete: "cascade" }),
    tipo: tipoSeguimientoEnum("tipo").notNull(),
    descripcion: text("descripcion").notNull(),
    resultado: resultadoSeguimientoEnum("resultado").notNull(),
    duracion_minutos: integer("duracion_minutos"),
    usuario_id: uuid("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    clienteIdx: index("idx_seguimientos_cliente").on(table.cliente_id),
    // Índice ascendente: Postgres puede recorrerlo hacia atrás para ORDER BY created_at DESC.
    createdAtIdx: index("idx_seguimientos_created_at").on(table.created_at),
  })
);

export const tareas = pgTable(
  "tareas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    titulo: text("titulo").notNull(),
    descripcion: text("descripcion"),
    cliente_id: uuid("cliente_id").references(() => clientes.id, { onDelete: "cascade" }),
    responsable_id: uuid("responsable_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    fecha_vencimiento: timestamp("fecha_vencimiento", { withTimezone: true }).notNull(),
    prioridad: prioridadEnum("prioridad").notNull().default("media"),
    estado: estadoTareaEnum("estado").notNull().default("pendiente"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    clienteResponsableIdx: index("idx_tareas_cliente_responsable").on(table.cliente_id, table.responsable_id),
    fechaVencimientoIdx: index("idx_tareas_fecha_vencimiento").on(table.fecha_vencimiento),
  })
);

export const documentos = pgTable(
  "documentos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cliente_id: uuid("cliente_id")
      .notNull()
      .references(() => clientes.id, { onDelete: "cascade" }),
    tipo: tipoDocumentoEnum("tipo").notNull(),
    nombre: text("nombre").notNull(),
    url: text("url").notNull(),
    uploaded_by: uuid("uploaded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    clienteIdx: index("idx_documentos_cliente").on(table.cliente_id),
  })
);

export const mensajes = pgTable(
  "mensajes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Un solo canal general por ahora (chat de equipo) — no hay mensajes
    // directos (DM) todavía; se puede agregar un `canal`/`destinatario_id`
    // más adelante sin romper esta tabla.
    usuario_id: uuid("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contenido: text("contenido").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("idx_mensajes_created_at").on(table.created_at),
  })
);

export const notificaciones = pgTable(
  "notificaciones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tipo: tipoNotificacionEnum("tipo").notNull(),
    referencia_id: uuid("referencia_id"),
    leida: boolean("leida").notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userLeidaIdx: index("idx_notificaciones_user_leida").on(table.user_id, table.leida),
    createdAtIdx: index("idx_notificaciones_created_at").on(table.created_at),
  })
);

export const actividadLog = pgTable(
  "actividad_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Nullable + onDelete "set null": el log de auditoría debe sobrevivir aunque se elimine el usuario.
    usuario_id: uuid("usuario_id").references(() => users.id, { onDelete: "set null" }),
    entidad: text("entidad").notNull(),
    entidad_id: uuid("entidad_id").notNull(),
    accion: accionLogEnum("accion").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    entidadIdx: index("idx_actividad_log_entidad").on(table.entidad, table.entidad_id),
    createdAtIdx: index("idx_actividad_log_created_at").on(table.created_at),
  })
);

// ============================================================
// Relaciones (para queries relacionales de Drizzle: db.query.clientes.findMany({ with: {...} }))
// ============================================================

export const usersRelations = relations(users, ({ many }) => ({
  clientesAsignados: many(clientes),
  tareasAsignadas: many(tareas),
  seguimientosRegistrados: many(seguimientos),
  documentosSubidos: many(documentos),
  mensajesEnviados: many(mensajes),
}));

export const mensajesRelations = relations(mensajes, ({ one }) => ({
  usuario: one(users, { fields: [mensajes.usuario_id], references: [users.id] }),
}));

export const clientesRelations = relations(clientes, ({ one, many }) => ({
  responsable: one(users, { fields: [clientes.responsable_id], references: [users.id] }),
  oportunidades: many(oportunidades),
  seguimientos: many(seguimientos),
  tareas: many(tareas),
  documentos: many(documentos),
}));

export const oportunidadesRelations = relations(oportunidades, ({ one }) => ({
  cliente: one(clientes, { fields: [oportunidades.cliente_id], references: [clientes.id] }),
  responsable: one(users, { fields: [oportunidades.responsable_id], references: [users.id] }),
}));

export const seguimientosRelations = relations(seguimientos, ({ one }) => ({
  cliente: one(clientes, { fields: [seguimientos.cliente_id], references: [clientes.id] }),
  usuario: one(users, { fields: [seguimientos.usuario_id], references: [users.id] }),
}));

export const tareasRelations = relations(tareas, ({ one }) => ({
  cliente: one(clientes, { fields: [tareas.cliente_id], references: [clientes.id] }),
  responsable: one(users, { fields: [tareas.responsable_id], references: [users.id] }),
}));

export const documentosRelations = relations(documentos, ({ one }) => ({
  cliente: one(clientes, { fields: [documentos.cliente_id], references: [clientes.id] }),
  subidoPor: one(users, { fields: [documentos.uploaded_by], references: [users.id] }),
}));
