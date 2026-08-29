import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para uso en Client Components. Reenvía el JWT del
 * usuario en cada request, por lo que las políticas RLS de Postgres se
 * aplican automáticamente — nunca hace falta filtrar "a mano" en el cliente.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
