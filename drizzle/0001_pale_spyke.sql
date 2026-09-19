CREATE TABLE IF NOT EXISTS "mensajes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"contenido" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mensajes_created_at" ON "mensajes" USING btree ("created_at");