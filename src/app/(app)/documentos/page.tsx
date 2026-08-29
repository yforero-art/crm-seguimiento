"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { DocumentFolderGrid, SIN_CLIENTE } from "@/components/documentos/DocumentFolderGrid";
import { DocumentList } from "@/components/documentos/DocumentList";
import type { DocumentoItem } from "@/components/documentos/DocumentList";
import { DocumentUploadForm } from "@/components/documentos/DocumentUploadForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CLIENTES_INICIALES } from "@/lib/mock/clientes";
import { DOCUMENTOS_INICIALES } from "@/lib/mock/documentos";
import type { DocumentoUploadInput } from "@/lib/validations/documento.schema";

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<DocumentoItem[]>(DOCUMENTOS_INICIALES);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  // null = viendo la grilla de carpetas; string = dentro de la carpeta de ese cliente (o SIN_CLIENTE).
  const [carpetaAbierta, setCarpetaAbierta] = useState<string | null>(null);

  const documentosDeLaCarpeta = useMemo(() => {
    if (carpetaAbierta === null) return [];
    return documentos.filter((d) => (d.cliente ?? SIN_CLIENTE) === carpetaAbierta);
  }, [documentos, carpetaAbierta]);

  const clienteIdParaSubida = useMemo(() => {
    if (!carpetaAbierta || carpetaAbierta === SIN_CLIENTE) return undefined;
    return CLIENTES_INICIALES.find((c) => c.empresa === carpetaAbierta)?.id;
  }, [carpetaAbierta]);

  function handleSubmit(data: DocumentoUploadInput) {
    // TODO(Fase 6): reemplazar por upload a Supabase Storage + createDocumento() (Server Action).
    const cliente = data.cliente_id ? CLIENTES_INICIALES.find((c) => c.id === data.cliente_id)?.empresa : undefined;
    const nuevo: DocumentoItem = {
      id: crypto.randomUUID(),
      nombre: data.nombre,
      tipo: data.tipo,
      cliente,
      fecha: new Date(),
      tamanoBytes: 0,
      url: "#",
    };
    setDocumentos((prev) => [nuevo, ...prev]);
    setDialogAbierto(false);
  }

  const nombreCarpeta = carpetaAbierta === SIN_CLIENTE ? "Sin cliente" : carpetaAbierta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {carpetaAbierta === null ? (
            <h1 className="text-2xl font-semibold text-foreground">Documentos</h1>
          ) : (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setCarpetaAbierta(null)}
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Documentos
              </button>
              <h1 className="text-2xl font-semibold text-foreground">{nombreCarpeta}</h1>
            </div>
          )}
        </div>
        <Button onClick={() => setDialogAbierto(true)} className="bg-success text-success-foreground hover:bg-success/90 sm:w-auto">
          <Plus className="h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      {carpetaAbierta === null ? (
        <DocumentFolderGrid documentos={documentos} onAbrirCarpeta={setCarpetaAbierta} />
      ) : (
        <DocumentList documentos={documentosDeLaCarpeta} />
      )}

      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Subir Documento</DialogTitle>
          </DialogHeader>
          <DocumentUploadForm onSubmit={handleSubmit} onCancel={() => setDialogAbierto(false)} clienteIdInicial={clienteIdParaSubida} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
