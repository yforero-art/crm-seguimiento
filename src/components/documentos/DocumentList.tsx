"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DocumentCard, type TipoArchivo } from "@/components/documentos/DocumentCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { formatFileSize } from "@/lib/utils/format";

export interface DocumentoItem {
  id: string;
  nombre: string;
  tipo: TipoArchivo;
  fecha: Date;
  tamanoBytes: number;
  url: string;
  cliente?: string;
}

interface DocumentListProps {
  documentos: DocumentoItem[];
}

const FILTROS_TIPO: { value: TipoArchivo | null; label: string }[] = [
  { value: null, label: "Todos" },
  { value: "pdf", label: "PDF" },
  { value: "word", label: "Word" },
  { value: "excel", label: "Excel" },
  { value: "imagen", label: "Imágenes" },
];

export function DocumentList({ documentos }: DocumentListProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoArchivo | null>(null);
  const [ordenPor, setOrdenPor] = useState<"fecha" | "tamano">("fecha");

  const filtrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    const base = documentos.filter((d) => {
      const coincideBusqueda = !query || d.nombre.toLowerCase().includes(query);
      const coincideTipo = !filtroTipo || d.tipo === filtroTipo;
      return coincideBusqueda && coincideTipo;
    });

    return [...base].sort((a, b) =>
      ordenPor === "fecha" ? b.fecha.getTime() - a.fecha.getTime() : b.tamanoBytes - a.tamanoBytes
    );
  }, [documentos, busqueda, filtroTipo, ordenPor]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">Ordenar por:</span>
          {(["fecha", "tamano"] as const).map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setOrdenPor(opcion)}
              className={cn(
                "rounded-full border px-2.5 py-1 font-medium capitalize transition-colors",
                ordenPor === opcion
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {opcion === "tamano" ? "Tamaño" : "Fecha"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTROS_TIPO.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFiltroTipo(f.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              filtroTipo === f.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {filtrados.length} de {documentos.length} documentos
      </p>

      {filtrados.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          No hay documentos que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filtrados.map((doc) => (
            <DocumentCard
              key={doc.id}
              nombre={doc.nombre}
              tipo={doc.tipo}
              fecha={doc.fecha}
              tamano={formatFileSize(doc.tamanoBytes)}
              url={doc.url}
              cliente={doc.cliente}
            />
          ))}
        </div>
      )}
    </div>
  );
}
