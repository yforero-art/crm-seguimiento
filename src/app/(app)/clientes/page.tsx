"use client";

import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ClienteForm } from "@/components/clientes/ClienteForm";
import { ClienteTable, type ClienteRow } from "@/components/clientes/ClienteTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CIUDADES_DISPONIBLES, CLIENTES_INICIALES } from "@/lib/mock/clientes";
import { nombreUsuario } from "@/lib/mock/responsables";
import { cn } from "@/lib/utils/cn";
import { ESTADOS_CLIENTE, PRIORIDADES } from "@/lib/utils/constants";
import type { ClienteInput } from "@/lib/validations/cliente.schema";
import type { Cliente, EstadoCliente, Prioridad } from "@/types";


function clienteToRow(cliente: Cliente): ClienteRow {
  return {
    id: cliente.id,
    empresa: cliente.empresa,
    nombre_contacto: cliente.nombre_contacto,
    email: cliente.email,
    telefono: cliente.telefono,
    estado: cliente.estado,
    prioridad: cliente.prioridad,
    responsable: nombreUsuario(cliente.responsable_id),
  };
}

interface FiltroChipsProps<T extends string> {
  label: string;
  opciones: { value: T; label: string }[];
  activo: T | null;
  onChange: (value: T | null) => void;
}

function FiltroChips<T extends string>({ label, opciones, activo, onChange }: FiltroChipsProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-medium text-muted-foreground">{label}:</span>
      {opciones.map((op) => (
        <button
          key={op.value}
          type="button"
          onClick={() => onChange(activo === op.value ? null : op.value)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            activo === op.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoCliente | null>(null);
  const [filtroPrioridad, setFiltroPrioridad] = useState<Prioridad | null>(null);
  const [filtroCiudad, setFiltroCiudad] = useState<string | null>(null);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  const filtrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    return clientes.filter((c) => {
      const coincideBusqueda =
        !query || c.empresa.toLowerCase().includes(query) || c.nombre_contacto.toLowerCase().includes(query);
      const coincideEstado = !filtroEstado || c.estado === filtroEstado;
      const coincidePrioridad = !filtroPrioridad || c.prioridad === filtroPrioridad;
      const coincideCiudad = !filtroCiudad || c.ciudad === filtroCiudad;
      return coincideBusqueda && coincideEstado && coincidePrioridad && coincideCiudad;
    });
  }, [clientes, busqueda, filtroEstado, filtroPrioridad, filtroCiudad]);

  const hayFiltrosActivos = Boolean(filtroEstado || filtroPrioridad || filtroCiudad || busqueda);

  function limpiarFiltros() {
    setBusqueda("");
    setFiltroEstado(null);
    setFiltroPrioridad(null);
    setFiltroCiudad(null);
  }

  function handleNuevo() {
    setClienteEditando(null);
    setDialogAbierto(true);
  }

  function handleEdit(id: string) {
    setClienteEditando(clientes.find((c) => c.id === id) ?? null);
    setDialogAbierto(true);
  }

  function handleDelete(id: string) {
    // TODO(Fase 3): reemplazar por deleteCliente() (Server Action) con soft delete.
    setClientes((prev) => prev.filter((c) => c.id !== id));
  }

  function handleSubmit(data: ClienteInput) {
    // TODO(Fase 3): reemplazar por createCliente()/updateCliente() (Server Actions).
    if (clienteEditando) {
      setClientes((prev) =>
        prev.map((c) =>
          c.id === clienteEditando.id
            ? {
                ...c,
                ...data,
                cargo: data.cargo || null,
                email: data.email || null,
                telefono: data.telefono || null,
                whatsapp: data.whatsapp || null,
                ciudad: data.ciudad ?? c.ciudad,
                nit: data.nit || null,
                origen: data.origen ?? null,
                sector: data.sector ?? null,
                regimen_tributario: data.regimen_tributario ?? null,
                responsable_id: data.responsable_id ?? null,
                observaciones: data.observaciones || null,
              }
            : c
        )
      );
    } else {
      const nuevo: Cliente = {
        id: crypto.randomUUID(),
        empresa: data.empresa,
        nombre_contacto: data.nombre_contacto,
        cargo: data.cargo || null,
        email: data.email || null,
        telefono: data.telefono || null,
        whatsapp: data.whatsapp || null,
        ciudad: data.ciudad ?? null,
        nit: data.nit || null,
        estado: "prospecto",
        prioridad: data.prioridad,
        origen: data.origen ?? null,
        sector: data.sector ?? null,
        regimen_tributario: data.regimen_tributario ?? null,
        revisor_fiscal: data.revisor_fiscal,
        requiere_auditoria: data.requiere_auditoria,
        observaciones: data.observaciones || null,
        responsable_id: data.responsable_id ?? null,
        created_at: new Date(),
      };
      setClientes((prev) => [nuevo, ...prev]);
    }
    setDialogAbierto(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
        <Button onClick={handleNuevo} className="bg-success text-success-foreground hover:bg-success/90 sm:w-auto">
          <Plus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o empresa..."
              className="pl-9"
            />
          </div>
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-1 self-start text-xs font-medium text-muted-foreground hover:text-foreground sm:self-auto"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
          <FiltroChips
            label="Estado"
            activo={filtroEstado}
            onChange={setFiltroEstado}
            opciones={Object.entries(ESTADOS_CLIENTE).map(([value, { label }]) => ({ value: value as EstadoCliente, label }))}
          />
          <FiltroChips
            label="Prioridad"
            activo={filtroPrioridad}
            onChange={setFiltroPrioridad}
            opciones={Object.entries(PRIORIDADES).map(([value, { label }]) => ({ value: value as Prioridad, label }))}
          />
          <FiltroChips
            label="Ciudad"
            activo={filtroCiudad}
            onChange={setFiltroCiudad}
            opciones={CIUDADES_DISPONIBLES.map((ciudad) => ({ value: ciudad, label: ciudad }))}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtrados.length} de {clientes.length} clientes
      </p>

      <ClienteTable clientes={filtrados.map(clienteToRow)} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          </DialogHeader>
          <ClienteForm cliente={clienteEditando ?? undefined} onSubmit={handleSubmit} onCancel={() => setDialogAbierto(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
