import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils/cn";

interface ChatMessageProps {
  nombre: string;
  contenido: string;
  fecha: Date;
  esPropio: boolean;
}

function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

export function ChatMessage({ nombre, contenido, fecha, esPropio }: ChatMessageProps) {
  return (
    <div className={cn("flex items-end gap-2", esPropio && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
          esPropio ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        {iniciales(nombre)}
      </div>

      <div className={cn("flex max-w-[75%] flex-col gap-0.5", esPropio && "items-end")}>
        {!esPropio && <span className="px-1 text-xs font-medium text-muted-foreground">{nombre}</span>}
        <div
          className={cn(
            "whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm",
            esPropio
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm border border-border bg-card text-foreground"
          )}
        >
          {contenido}
        </div>
        <span className="px-1 text-[11px] text-muted-foreground">
          {formatDistanceToNowStrict(fecha, { addSuffix: true, locale: es })}
        </span>
      </div>
    </div>
  );
}
