"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Documentos</h1>
        <Button onClick={() => setDialogAbierto(true)} className="bg-success text-success-foreground hover:bg-success/90 sm:w-auto">
          <Plus className="h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      <DocumentList documentos={documentos} />

      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Subir Documento</DialogTitle>
          </DialogHeader>
          <DocumentUploadForm onSubmit={handleSubmit} onCancel={() => setDialogAbierto(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
