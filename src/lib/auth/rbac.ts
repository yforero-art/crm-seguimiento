import type { Rol, User } from "@/types";

type Action = "create" | "read" | "update" | "delete";
type Resource = "cliente" | "oportunidad" | "seguimiento" | "tarea" | "documento" | "usuario" | "reporte";

/**
 * Reglas base de autorización a nivel de aplicación. Es la SEGUNDA de tres
 * capas de defensa (ver blueprint §6): la UI oculta opciones por comodidad,
 * `can()` revalida en cada Server Action, y las políticas RLS de Postgres son
 * la capa que realmente garantiza el aislamiento de datos entre auxiliares.
 *
 * `can()` decide si la ACCIÓN está permitida para el rol; no decide el ALCANCE
 * (p. ej. si el auxiliar es dueño del recurso) — eso lo resuelve RLS mediante
 * `responsable_id = auth.uid()` en cada tabla.
 */
export function can(user: User, action: Action, resource: Resource): boolean {
  if (user.rol === "admin") return true;

  switch (resource) {
    case "usuario":
      return false; // solo admin gestiona usuarios
    case "reporte":
      return action === "read";
    case "cliente":
    case "oportunidad":
    case "seguimiento":
    case "tarea":
    case "documento":
      return action !== "delete"; // auxiliar crea/lee/edita; RLS limita el alcance a lo suyo
    default:
      return false;
  }
}

export function requireRole(user: User, rol: Rol): void {
  if (user.rol !== rol) {
    throw new Error(`Acción no permitida: se requiere rol "${rol}".`);
  }
}

export function isOwner(user: User, responsableId: string | null): boolean {
  return user.rol === "admin" || responsableId === user.id;
}
