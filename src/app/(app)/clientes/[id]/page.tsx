"use client";

import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ClienteForm } from "@/components/clientes/ClienteForm";
import { ProximoPasoDialog } from "@/components/seguimiento/ProximoPasoDialog";
import { SeguimientoForm } from "@/components/seguimiento/SeguimientoForm";
import { Timeline } from "@/components/seguimiento/Timeline";
import type { TimelineSeguimiento } from "@/components/seguimiento/TimelineItem";
import { EstadoBadge } from "@/components/shared/EstadoBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLIENTES_INICIALES } from "@/lib/mock/clientes";
import { nombreUsuario } from "@/lib/mock/responsables";
import { getSeguimientosCliente } from "@/lib/mock/seguimientos";
import { cn } from "@/lib/utils/cn";
import { ORIGENES_CLIENTE, REGIMENES_TRIBUTARIOS, SECTORES_CLIENTE } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/format";
import type { ClienteInput } from "@/lib/validations/cliente.schema";
import type { SeguimientoInput } from "@/lib/validations/seguimiento.schema";

const TRES_DIAS_MS = 3 * 24 * 60 * 60 * 1000;

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();

  const clienteInicial = CLIENTES_INICIALES.find((c) => c.id === id);
  if (!clienteInicial) notFound();

  const [cliente, setCliente] = useState(clienteInicial);
  const [editarClienteAbierto, setEditarClienteAbierto] = useState(false);

  const [seguimientos, setSeguimientos] = useState<TimelineSeguimiento[]>(() => getSeguimientosCliente(id));
  const [seguimientoDialogAbierto, setSeguimientoDialogAbierto] = useState(false);
  const [seguimientoEditando, setSeguimientoEditando] = useState<TimelineSeguimiento | null>(null);
  const [proximoPasoAbierto, setProximoPasoAbierto] = useState(false);
  const [tareaCreada, setTareaCreada] = useState<{ titulo: string; fechaVencimiento: Date } | null>(null);

  function handleEditarCliente(data: ClienteInput) {
    // TODO(Fase 3): reemplazar por updateCliente() (Server Action). Este cambio
    // solo vive en esta página — la lista en /clientes usa su propia copia local.
    setCliente((prev) => ({
      ...prev,
      ...data,
      cargo: data.cargo || null,
      email: data.email || null,
      telefono: data.telefono || null,
      whatsapp: data.whatsapp || null,
      ciudad: data.ciudad ?? prev.ciudad,
      nit: data.nit || null,
      origen: data.origen ?? null,
      sector: data.sector ?? null,
      regimen_tributario: data.regimen_tributario ?? null,
      responsable_id: data.responsable_id ?? null,
      observaciones: data.observaciones || null,
    }));
    setEditarClienteAbierto(false);
  }

  function handleAgregarSeguimiento() {
    setSeguimientoEditando(null);
    setSeguimientoDialogAbierto(true);
  }

  function handleEditarSeguimiento(seguimientoId: string) {
    const encontrado = seguimientos.find((s) => s.id === seguimientoId);
    if (!encontrado) return;
    setSeguimientoEditando(encontrado);
    setSeguimientoDialogAbierto(true);
  }

  function handleEliminarSeguimiento(seguimientoId: string) {
    // TODO(Fase 3): reemplazar por deleteSeguimiento() (Server Action).
    setSeguimientos((prev) => prev.filter((s) => s.id !== seguimientoId));
  }

  function handleSeguimientoSubmit(data: SeguimientoInput) {
    // TODO(Fase 3): reemplazar por createSeguimiento()/updateSeguimiento()
    // (Server Actions) + usuario_id real de la sesión autenticada.
    if (seguimientoEditando) {
      setSeguimientos((prev) =>
        prev.map((s) => (s.id === seguimientoEditando.id ? { ...s, ...data, duracion_minutos: data.duracion_minutos ?? null } : s))
      );
      setSeguimientoDialogAbierto(false);
      setSeguimientoEditando(null);
      return;
    }

    const nuevo: TimelineSeguimiento = {
      id: crypto.randomUUID(),
      tipo: data.tipo,
      descripcion: data.descripcion,
      resultado: data.resultado,
      duracion_minutos: data.duracion_minutos ?? null,
      usuario: "Tú",
      created_at: new Date(),
    };
    setSeguimientos((prev) => [nuevo, ...prev]);
    setSeguimientoDialogAbierto(false);
    setProximoPasoAbierto(true);
  }

  function handleProximoPasoConfirm(paso: string) {
    // TODO(Fase 3): reemplazar por createTarea() (Server Action) real.
    setTareaCreada({ titulo: `${paso} — ${cliente.empresa}`, fechaVencimiento: new Date(Date.now() + TRES_DIAS_MS) });
    setProximoPasoAbierto(false);
  }

  function handleProximoPasoSkip() {
    setProximoPasoAbierto(false);
  }

  const responsableNombre = nombreUsuario(cliente.responsable_id) ?? "Sin asignar";
  const whatsappHref = cliente.whatsapp ? `https://wa.me/57${cliente.whatsapp.replace(/\D/g, "")}` : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/clientes" className="hover:text-foreground hover:underline">
          Clientes
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{cliente.empresa}</span>
      </nav>

      {/* Encabezado */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">{cliente.empresa}</h1>
                <EstadoBadge estado={cliente.estado} />
              </div>
              <p className="text-sm text-muted-foreground">
                {cliente.nombre_contacto}
                {cliente.cargo && ` · ${cliente.cargo}`}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {cliente.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {cliente.email}
                  </span>
                )}
                {cliente.telefono && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {cliente.telefono}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button variant="outline" size="sm" onClick={() => setEditarClienteAbierto(true)}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <AccionContactoButton href={cliente.telefono ? `tel:${cliente.telefono.replace(/\s/g, "")}` : null} icon={Phone} label="Llamar" />
            <AccionContactoButton href={cliente.email ? `mailto:${cliente.email}` : null} icon={Mail} label="Email" />
            <AccionContactoButton href={whatsappHref} icon={MessageCircle} label="WhatsApp" external />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="seguimiento">
        <TabsList>
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        {/* Información */}
        <TabsContent value="informacion" className="mt-4">
          <Card>
            <CardContent className="grid grid-cols-1 gap-x-8 gap-y-4 p-6 sm:grid-cols-2">
              <InfoField label="NIT" value={cliente.nit ?? "—"} />
              <InfoField label="Ciudad" value={cliente.ciudad ?? "—"} />
              <InfoField
                label="Régimen Tributario"
                value={cliente.regimen_tributario ? REGIMENES_TRIBUTARIOS[cliente.regimen_tributario].label : "—"}
              />
              <InfoField label="Responsable" value={responsableNombre} />
              <InfoField label="Revisor Fiscal" value={cliente.revisor_fiscal ? "Sí" : "No"} />
              <InfoField label="Requiere Auditoría" value={cliente.requiere_auditoria ? "Sí" : "No"} />
              <InfoField label="Origen" value={cliente.origen ? ORIGENES_CLIENTE[cliente.origen].label : "—"} />
              <InfoField label="Sector" value={cliente.sector ? SECTORES_CLIENTE[cliente.sector].label : "—"} />
              <InfoField label="Cliente desde" value={formatDate(cliente.created_at)} />
              <InfoField label="Prioridad" value={<EstadoBadge estado={cliente.prioridad} tamano="sm" />} />
              <div className="sm:col-span-2">
                <InfoField label="Observaciones" value={cliente.observaciones ?? "Sin observaciones."} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Oportunidades */}
        <TabsContent value="oportunidades" className="mt-4">
          <div className="rounded-lg border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            Módulo de Oportunidades — próxima fase.
          </div>
        </TabsContent>

        {/* Seguimiento */}
        <TabsContent value="seguimiento" className="mt-4 space-y-4">
          {tareaCreada && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-success/20 bg-success/10 p-3 text-sm text-success">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Tarea creada: <span className="font-medium">{tareaCreada.titulo}</span> — vence el{" "}
                  {formatDate(tareaCreada.fechaVencimiento)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTareaCreada(null)}
                className="shrink-0 text-success/70 hover:text-success"
                aria-label="Cerrar aviso"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <Timeline
            seguimientos={seguimientos}
            onAddSeguimiento={handleAgregarSeguimiento}
            onEdit={handleEditarSeguimiento}
            onDelete={handleEliminarSeguimiento}
          />
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documentos" className="mt-4">
          <div className="rounded-lg border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            Módulo de Documentos — próxima fase.
          </div>
        </TabsContent>
      </Tabs>

      {/* Editar cliente */}
      <Dialog open={editarClienteAbierto} onOpenChange={setEditarClienteAbierto}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <ClienteForm cliente={cliente} onSubmit={handleEditarCliente} onCancel={() => setEditarClienteAbierto(false)} />
        </DialogContent>
      </Dialog>

      {/* Registrar / editar seguimiento */}
      <Dialog
        open={seguimientoDialogAbierto}
        onOpenChange={(open) => {
          setSeguimientoDialogAbierto(open);
          if (!open) setSeguimientoEditando(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{seguimientoEditando ? "Editar Seguimiento" : "Agregar Seguimiento"}</DialogTitle>
          </DialogHeader>
          <SeguimientoForm
            seguimiento={
              seguimientoEditando
                ? { ...seguimientoEditando, duracion_minutos: seguimientoEditando.duracion_minutos ?? undefined }
                : undefined
            }
            onSubmit={handleSeguimientoSubmit}
            onCancel={() => setSeguimientoDialogAbierto(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ¿Próximo paso? */}
      <ProximoPasoDialog
        open={proximoPasoAbierto}
        onOpenChange={setProximoPasoAbierto}
        onConfirm={handleProximoPasoConfirm}
        onSkip={handleProximoPasoSkip}
      />
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={cn("text-sm text-foreground")}>{value}</dd>
    </div>
  );
}

interface AccionContactoButtonProps {
  href: string | null;
  icon: LucideIcon;
  label: string;
  external?: boolean;
}

// Un <a> no soporta el atributo `disabled` (los navegadores lo ignoran), así
// que cuando falta el dato (sin teléfono/email/WhatsApp) se renderiza un
// <Button disabled> real en vez de intentar deshabilitar un enlace via asChild.
function AccionContactoButton({ href, icon: Icon, label, external }: AccionContactoButtonProps) {
  if (!href) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        <Icon className="h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}
