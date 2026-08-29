import { Download, FileSpreadsheet, FileText, Image as ImageIcon, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";

export type TipoArchivo = "pdf" | "word" | "excel" | "imagen";

interface DocumentCardProps {
  nombre: string;
  tipo: TipoArchivo;
  fecha: Date;
  tamano: string;
  url: string;
  cliente?: string;
}

const ARCHIVO_ESTILO: Record<TipoArchivo, { icon: LucideIcon; classes: string; label: string }> = {
  pdf: { icon: FileText, classes: "bg-destructive/10 text-destructive", label: "PDF" },
  word: { icon: FileText, classes: "bg-primary/10 text-primary", label: "Word" },
  excel: { icon: FileSpreadsheet, classes: "bg-success/10 text-success", label: "Excel" },
  imagen: { icon: ImageIcon, classes: "bg-purple/10 text-purple", label: "Imagen" },
};

export function DocumentCard({ nombre, tipo, fecha, tamano, url, cliente }: DocumentCardProps) {
  const { icon: Icon, classes } = ARCHIVO_ESTILO[tipo];
  // No hay backend de archivos todavía (Fase 6 conecta Supabase Storage), así
  // que "url" es un placeholder — el botón queda deshabilitado en vez de
  // ofrecer una descarga que en realidad no sirve ningún archivo real.
  const descargaDisponible = url !== "#";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", classes)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{nombre}</p>
        <p className="truncate text-xs text-muted-foreground">
          {cliente && `${cliente} · `}
          {formatDate(fecha, "d MMM yyyy")} · {tamano}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        disabled={!descargaDisponible}
        title={descargaDisponible ? "Descargar" : "Documento de ejemplo — sin archivo real todavía"}
        aria-label={`Descargar ${nombre}`}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
