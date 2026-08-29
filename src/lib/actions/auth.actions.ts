"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema";

// Nota: la página de login (src/app/(auth)/login/page.tsx) usa el cliente de
// Supabase del navegador directamente, para que las cookies de sesión las
// escriba el propio browser. Esta Server Action queda disponible como
// alternativa (ej. para un futuro flujo sin JS o de testing).
export async function loginAction(input: LoginInput) {
  const data = loginSchema.parse(input);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw new Error("Correo o contraseña incorrectos.");

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
