import "server-only";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para Server Components y Server Actions. Lee/escribe la
 * sesión desde las cookies de la request — respeta RLS igual que el cliente
 * de navegador porque opera con el JWT del usuario autenticado.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Se invocó desde un Server Component (no una Server Action/Route Handler).
            // El middleware ya se encarga de refrescar la cookie de sesión en cada request.
          }
        },
      },
    }
  );
}

/**
 * Cliente con privilegios de servicio: BYPASSA Row Level Security por completo.
 * Uso exclusivo en jobs server-side (cron, exports, tareas administrativas de
 * fondo). Si se usa en una ruta que atiende input de usuario, hay que revalidar
 * la autorización manualmente antes de cada query — nunca confiar en el cliente.
 */
export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}
