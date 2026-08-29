import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida. Copia .env.example a .env.local y complétala.");
}

// `prepare: false` es requerido cuando la conexión pasa por el connection pooler
// de Supabase (pgbouncer en modo transacción), que no soporta prepared statements.
const queryClient = postgres(connectionString, { prepare: false });

export const db = drizzle(queryClient, { schema });
