"use client";

import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EstadoBadge } from "@/components/shared/EstadoBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface ClienteRow {
  id: string;
  empresa: string;
  nombre_contacto: string;
  email: string | null;
  telefono: string | null;
  estado: string;
  responsable?: string | null;
  prioridad: string;
}

interface ClienteTableProps {
  clientes: ClienteRow[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

type SortKey = "empresa" | "nombre_contacto" | "email" | "telefono" | "estado" | "prioridad";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "empresa", label: "Empresa" },
  { key: "nombre_contacto", label: "Contacto" },
  { key: "email", label: "Email" },
  { key: "telefono", label: "Teléfono" },
  { key: "estado", label: "Estado" },
  { key: "prioridad", label: "Prioridad" },
];

export function ClienteTable({ clientes, onEdit, onDelete }: ClienteTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("empresa");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    const copy = [...clientes];
    copy.sort((a, b) => {
      const comparison = (a[sortKey] ?? "").toString().localeCompare((b[sortKey] ?? "").toString(), "es");
      return sortDir === "asc" ? comparison : -comparison;
    });
    return copy;
  }, [clientes, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  if (clientes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center text-sm text-muted-foreground">
        No hay clientes que coincidan con los filtros.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead className="bg-muted/60">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} className="border-b border-border px-4 py-3 text-left font-medium text-muted-foreground">
                <button
                  type="button"
                  onClick={() => toggleSort(col.key)}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  {col.label}
                  <ArrowUpDown className={cn("h-3.5 w-3.5", sortKey === col.key ? "text-foreground" : "text-muted-foreground/40")} />
                </button>
              </th>
            ))}
            <th className="border-b border-border px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((cliente, index) => (
            <tr key={cliente.id} className={cn("transition-colors hover:bg-accent", index % 2 === 1 && "bg-muted/30")}>
              <td className="border-b border-border px-4 py-3">
                <Link href={`/clientes/${cliente.id}`} className="font-medium text-primary hover:underline">
                  {cliente.empresa}
                </Link>
              </td>
              <td className="border-b border-border px-4 py-3 text-foreground">{cliente.nombre_contacto}</td>
              <td className="border-b border-border px-4 py-3 text-muted-foreground">{cliente.email || "—"}</td>
              <td className="border-b border-border px-4 py-3 text-muted-foreground">{cliente.telefono || "—"}</td>
              <td className="border-b border-border px-4 py-3">
                <EstadoBadge estado={cliente.estado} tamano="sm" />
              </td>
              <td className="border-b border-border px-4 py-3">
                <EstadoBadge estado={cliente.prioridad} tamano="sm" />
              </td>
              <td className="border-b border-border px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Editar ${cliente.empresa}`}
                    onClick={() => onEdit?.(cliente.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Eliminar ${cliente.empresa}`}
                    onClick={() => onDelete?.(cliente.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
