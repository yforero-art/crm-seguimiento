import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@/types";

/**
 * Devuelve el perfil completo (tabla `users`, con rol incluido) del usuario
 * autenticado, o null si no hay sesión. No redirige — para eso usar requireAuth().
 */
export async function getSession(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // La app sigue en fase de datos mock (ver README) — si Postgres no está
  // realmente accesible todavía (DATABASE_URL mal configurada, IPv6 no
  // disponible, proyecto pausado, etc.) no se debe tumbar toda la navegación
  // por un error de conexión; se trata como "sin perfil" y listo.
  try {
    const [profile] = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1);
    return profile ?? null;
  } catch (error) {
    console.error("[getSession] No se pudo consultar la tabla `users` en Postgres:", error);
    return null;
  }
}

/**
 * Igual que getSession() pero redirige a /login si no hay sesión. Pensado
 * para usarse al inicio de layouts/páginas protegidas y Server Actions.
 */
export async function requireAuth(): Promise<User> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
