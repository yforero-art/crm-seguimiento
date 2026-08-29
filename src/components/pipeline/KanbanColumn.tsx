"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Inbox } from "lucide-react";
import { KanbanCard, type KanbanOportunidad } from "@/components/pipeline/KanbanCard";
import { cn } from "@/lib/utils/cn";
import { formatCurrencyCompact } from "@/lib/utils/format";

interface KanbanColumnProps {
  etapa: string;
  label: string;
  color: string;
  cards: KanbanOportunidad[];
  isOver?: boolean;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function KanbanColumn({ etapa, label, color, cards, isOver = false, onEdit, onDuplicate }: KanbanColumnProps) {
  // `setNodeRef` registra la columna como destino válido (imprescindible si
  // está vacía, ya que ahí no hay ninguna tarjeta-droppable que la reemplace).
  // El resaltado NO usa el `isOver` propio de este hook: con columnas que ya
  // tienen tarjetas, closestCorners casi siempre elige la tarjeta más cercana
  // en vez del contenedor, así que ese isOver rara vez se activa. El destino
  // "real" se resuelve una sola vez en KanbanBoard (con el mismo fallback que
  // usa onDragEnd) y baja como prop — de ahí sale el resaltado.
  const { setNodeRef } = useDroppable({ id: etapa, data: { etapa } });

  const valorTotal = cards.reduce((sum, c) => sum + c.valor, 0);

  return (
    <div className="flex w-72 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card snap-start">
      <div className="space-y-1 px-3 py-3" style={{ backgroundColor: color }}>
        <h3 className="text-sm font-semibold text-white">{label}</h3>
        <div className="flex items-center justify-between text-xs text-white/85">
          <span>
            {cards.length} {cards.length === 1 ? "oportunidad" : "oportunidades"}
          </span>
          <span className="font-medium">Total: {formatCurrencyCompact(valorTotal)}</span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2 overflow-y-auto bg-muted/40 p-2 transition-shadow duration-200",
          isOver && "shadow-[inset_0_0_0_2px_hsl(var(--primary))]"
        )}
        style={{ minHeight: 160 }}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableKanbanCard key={card.id} card={card} onEdit={onEdit} onDuplicate={onDuplicate} />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
            <Inbox className="h-6 w-6" />
            <p className="text-xs">Sin oportunidades</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SortableKanbanCardProps {
  card: KanbanOportunidad;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

function SortableKanbanCard({ card, onEdit, onDuplicate }: SortableKanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  return (
    <KanbanCard
      {...card}
      ref={setNodeRef}
      isDragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition: transition ?? undefined }}
      dragHandleProps={{ ...attributes, ...listeners }}
      onEdit={onEdit}
      onDuplicate={onDuplicate}
    />
  );
}
