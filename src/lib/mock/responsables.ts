// TODO(Fase 3): reemplazar por una consulta real a la tabla `users` (RLS: el
// admin ve todo el equipo, el auxiliar solo se ve a sí mismo). Estos IDs son
// fijos únicamente para que los datos ficticios de clientes referencien un
// responsable_id válido mientras no hay base de datos conectada.

export interface ResponsableOption {
  id: string;
  nombre: string;
}

export const RESPONSABLE_YESENIA: ResponsableOption = {
  id: "b6f1a2b0-0000-4000-8000-000000000001",
  nombre: "Yesenia Forero",
};

export const RESPONSABLE_ANDRES: ResponsableOption = {
  id: "b6f1a2b0-0000-4000-8000-000000000002",
  nombre: "Andrés Ruiz",
};

export const RESPONSABLE_CAMILA: ResponsableOption = {
  id: "b6f1a2b0-0000-4000-8000-000000000003",
  nombre: "Camila Torres",
};

export const RESPONSABLES_DEFAULT: ResponsableOption[] = [RESPONSABLE_YESENIA, RESPONSABLE_ANDRES, RESPONSABLE_CAMILA];

export function nombreUsuario(id: string | null | undefined): string | null {
  return RESPONSABLES_DEFAULT.find((r) => r.id === id)?.nombre ?? null;
}
