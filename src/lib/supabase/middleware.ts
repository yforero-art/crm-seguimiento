import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login"];

/**
 * Corre en Edge Runtime en toda request (ver matcher en src/middleware.ts).
 * Refresca la sesión de Supabase y bloquea el acceso a rutas protegidas sin
 * sesión válida. Esta es la primera de las tres capas de autorización del
 * proyecto — las otras dos son Server Actions y RLS en Postgres.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // IMPORTANTE: no eliminar esta llamada. getUser() revalida el JWT contra el
  // servidor de Supabase (a diferencia de getSession(), que solo lee la cookie
  // sin verificarla) y es lo que efectivamente refresca el token si expiró.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicRoute = PUBLIC_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route));

  if (!user && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
