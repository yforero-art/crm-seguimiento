"use server";

import { revalidatePath } from "next/cache";
import { can } from "@/lib/auth/rbac";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { clientes } from "@/lib/db/schema";
import { clienteSchema, clienteUpdateSchema } from "@/lib/validations/cliente.schema";
import type { Cliente } from "@/types";

export async function getClientes(): Promise<Cliente[]> {
  await requireAuth();
  // TODO(Fase 3): implementar listado con filtros (estado, prioridad, responsable).
  // RLS ya garantiza que un auxiliar solo recibe sus propios clientes.
  return db.select().from(clientes);
}

export async function createCliente(formData: unknown) {
  const user = await requireAuth();
  if (!can(user, "create", "cliente")) throw new Error("No tienes permiso para crear clientes.");

  const data = clienteSchema.parse(formData);
  // TODO(Fase 3): insertar en `clientes`; si user.rol === "auxiliar", forzar
  // responsable_id = user.id (no confiar en lo que envíe el formulario).
  void data;

  revalidatePath("/clientes");
}

export async function updateCliente(id: string, formData: unknown) {
  const user = await requireAuth();
  if (!can(user, "update", "cliente")) throw new Error("No tienes permiso para editar este cliente.");

  const data = clienteUpdateSchema.parse(formData);
  // TODO(Fase 3): actualizar `clientes` donde id = id.
  void data;

  revalidatePath(`/clientes/${id}`);
}

export async function deleteCliente(id: string) {
  const user = await requireAuth();
  if (!can(user, "delete", "cliente")) throw new Error("No tienes permiso para eliminar clientes.");

  // TODO(Fase 3): el blueprint recomienda soft delete (columna deleted_at) en
  // vez de DELETE físico por trazabilidad contable — falta agregar esa
  // columna al schema antes de implementar esta acción.
  void id;

  revalidatePath("/clientes");
}
