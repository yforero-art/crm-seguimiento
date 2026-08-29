CREATE TYPE "public"."accion_log" AS ENUM('crear', 'editar', 'eliminar', 'cambio_estado');--> statement-breakpoint
CREATE TYPE "public"."estado_cliente" AS ENUM('prospecto', 'primer_contacto', 'reunion', 'propuesta', 'negociacion', 'cliente_activo', 'perdido');--> statement-breakpoint
CREATE TYPE "public"."estado_tarea" AS ENUM('pendiente', 'en_progreso', 'completada', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."etapa_oportunidad" AS ENUM('prospecto', 'primer_contacto', 'reunion', 'propuesta', 'negociacion', 'ganado', 'perdido');--> statement-breakpoint
CREATE TYPE "public"."origen_cliente" AS ENUM('referido', 'linkedin', 'llamada_fria', 'website', 'google');--> statement-breakpoint
CREATE TYPE "public"."prioridad" AS ENUM('baja', 'media', 'alta');--> statement-breakpoint
CREATE TYPE "public"."regimen_tributario" AS ENUM('simple', 'ordinario', 'especial');--> statement-breakpoint
CREATE TYPE "public"."resultado_seguimiento" AS ENUM('positivo', 'neutral', 'negativo');--> statement-breakpoint
CREATE TYPE "public"."rol" AS ENUM('admin', 'auxiliar');--> statement-breakpoint
CREATE TYPE "public"."sector_cliente" AS ENUM('gastronomia', 'comercio', 'servicios', 'construccion', 'transporte');--> statement-breakpoint
CREATE TYPE "public"."tipo_documento" AS ENUM('cotizacion', 'contrato', 'factura', 'propuesta', 'acta');--> statement-breakpoint
CREATE TYPE "public"."tipo_notificacion" AS ENUM('tarea_vencida', 'reunion_hoy', 'asignacion', 'mencion');--> statement-breakpoint
CREATE TYPE "public"."tipo_seguimiento" AS ENUM('llamada', 'whatsapp', 'correo', 'reunion', 'nota', 'cotizacion', 'contrato', 'archivo');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "actividad_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid,
	"entidad" text NOT NULL,
	"entidad_id" uuid NOT NULL,
	"accion" "accion_log" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa" text NOT NULL,
	"nombre_contacto" text NOT NULL,
	"cargo" text,
	"email" text,
	"telefono" text,
	"whatsapp" text,
	"ciudad" text,
	"nit" text,
	"estado" "estado_cliente" DEFAULT 'prospecto' NOT NULL,
	"prioridad" "prioridad" DEFAULT 'media' NOT NULL,
	"origen" "origen_cliente",
	"sector" "sector_cliente",
	"regimen_tributario" "regimen_tributario",
	"revisor_fiscal" boolean DEFAULT false NOT NULL,
	"requiere_auditoria" boolean DEFAULT false NOT NULL,
	"observaciones" text,
	"responsable_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"tipo" "tipo_documento" NOT NULL,
	"nombre" text NOT NULL,
	"url" text NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notificaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tipo" "tipo_notificacion" NOT NULL,
	"referencia_id" uuid,
	"leida" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oportunidades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"valor_estimado" numeric(14, 2) NOT NULL,
	"probabilidad" integer NOT NULL,
	"valor_esperado" numeric(14, 2) GENERATED ALWAYS AS ((valor_estimado * probabilidad / 100)) STORED,
	"etapa" "etapa_oportunidad" DEFAULT 'prospecto' NOT NULL,
	"responsable_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "probabilidad_range" CHECK ("oportunidades"."probabilidad" >= 0 AND "oportunidades"."probabilidad" <= 100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seguimientos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"tipo" "tipo_seguimiento" NOT NULL,
	"descripcion" text NOT NULL,
	"resultado" "resultado_seguimiento" NOT NULL,
	"duracion_minutos" integer,
	"usuario_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tareas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text,
	"cliente_id" uuid,
	"responsable_id" uuid NOT NULL,
	"fecha_vencimiento" timestamp with time zone NOT NULL,
	"prioridad" "prioridad" DEFAULT 'media' NOT NULL,
	"estado" "estado_tarea" DEFAULT 'pendiente' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"nombre" text NOT NULL,
	"rol" "rol" DEFAULT 'auxiliar' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "actividad_log" ADD CONSTRAINT "actividad_log_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clientes" ADD CONSTRAINT "clientes_responsable_id_users_id_fk" FOREIGN KEY ("responsable_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documentos" ADD CONSTRAINT "documentos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documentos" ADD CONSTRAINT "documentos_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oportunidades" ADD CONSTRAINT "oportunidades_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oportunidades" ADD CONSTRAINT "oportunidades_responsable_id_users_id_fk" FOREIGN KEY ("responsable_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tareas" ADD CONSTRAINT "tareas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tareas" ADD CONSTRAINT "tareas_responsable_id_users_id_fk" FOREIGN KEY ("responsable_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_actividad_log_entidad" ON "actividad_log" USING btree ("entidad","entidad_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_actividad_log_created_at" ON "actividad_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_clientes_responsable" ON "clientes" USING btree ("responsable_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_clientes_estado" ON "clientes" USING btree ("estado");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_documentos_cliente" ON "documentos" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notificaciones_user_leida" ON "notificaciones" USING btree ("user_id","leida");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notificaciones_created_at" ON "notificaciones" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oportunidades_cliente" ON "oportunidades" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oportunidades_etapa" ON "oportunidades" USING btree ("etapa");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oportunidades_responsable" ON "oportunidades" USING btree ("responsable_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_seguimientos_cliente" ON "seguimientos" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_seguimientos_created_at" ON "seguimientos" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tareas_cliente_responsable" ON "tareas" USING btree ("cliente_id","responsable_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tareas_fecha_vencimiento" ON "tareas" USING btree ("fecha_vencimiento");