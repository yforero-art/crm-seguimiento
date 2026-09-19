"use server";

import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { mensajes } from "@/lib/db/schema";
import { mensajeSchema, type MensajeInput } from "@/lib/validations/mensaje.schema";
import type { Mensaje } from "@/types";

// TODO(Fase 7): una vez haya sesión real de Supabase Auth, tomar `usuario_id`
// de requireAuth() en vez de recibirlo del cliente. Hoy no hay login
// funcionando en ningún módulo de la app, así que el "usuario actual" lo
// simula el store del navegador (src/store/usuarioActualStore.ts) y viaja
// explícito en cada acción — es la misma realidad de toda la fase mock,
// simplemente aquí sí persiste de verdad en Postgres.

const LIMITE_MENSAJES = 100;

export async function getMensajes(): Promise<Mensaje[]> {
  const filas = await db.select().from(mensajes).orderBy(desc(mensajes.created_at)).limit(LIMITE_MENSAJES);
  return filas.reverse(); // más antiguo primero, como se lee un chat
}

export async function enviarMensaje(input: MensajeInput): Promise<Mensaje> {
  const data = mensajeSchema.parse(input);
  const [nuevo] = await db.insert(mensajes).values(data).returning();
  if (!nuevo) throw new Error("No se pudo enviar el mensaje.");
  return nuevo;
}
