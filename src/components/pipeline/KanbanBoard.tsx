"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { KanbanCard, type KanbanOportunidad } from "@/components/pipeline/KanbanCard";
import { KanbanColumn } from "@/components/pipeline/KanbanColumn";
import type { EtapaOportunidad } from "@/types";

export interface KanbanColumnData {
  etapa: EtapaOportunidad;
  label: string;
  color: string;
  oportunidades: KanbanOportunidad[];
}

interface KanbanBoardProps {
  columnas: KanbanColumnData[];
  onUpdateEtapa?: (id: string, nuevaEtapa: EtapaOportunidad) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function KanbanBoard({ columnas, onUpdateEtapa, onEdit, onDuplicate }: KanbanBoardProps) {
  const [activeCard, setActiveCard] = useState<KanbanOportunidad | null>(null);
  const [etapaSobre, setEtapaSobre] = useState<EtapaOportunidad | null>(null);

  // distance:6 evita que un simple click (sin intención de arrastrar) dispare
  // un drag accidental — deja pasar el click normal a los botones de la tarjeta.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const { cardById, etapaByCardId } = useMemo(() => {
    const cardMap = new Map<string, KanbanOportunidad>();
    const etapaMap = new Map<string, EtapaOportunidad>();
    for (const columna of columnas) {
      for (const oportunidad of columna.oportunidades) {
        cardMap.set(oportunidad.id, oportunidad);
        etapaMap.set(oportunidad.id, columna.etapa);
      }
    }
    return { cardById: cardMap, etapaByCardId: etapaMap };
  }, [columnas]);

  // `over.id` es el id de una columna (droppable de KanbanColumn) cuando se
  // arrastra sobre su área vacía, o el id de otra tarjeta cuando se arrastra
  // cerca de una — en ese segundo caso se resuelve a qué columna pertenece.
  function resolverEtapaDestino(overId: string): EtapaOportunidad | undefined {
    return columnas.find((c) => c.etapa === overId)?.etapa ?? etapaByCardId.get(overId);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveCard(cardById.get(String(event.active.id)) ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    if (!event.over) {
      setEtapaSobre(null);
      return;
    }
    setEtapaSobre(resolverEtapaDestino(String(event.over.id)) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    setEtapaSobre(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const etapaDestino = resolverEtapaDestino(String(over.id));
    if (!etapaDestino) return;

    const etapaOrigen = etapaByCardId.get(cardId);
    if (etapaOrigen && etapaOrigen !== etapaDestino) {
      onUpdateEtapa?.(cardId, etapaDestino);
    }
  }

  return (
    <DndContext
      // id fijo: por defecto dnd-kit genera un id incremental para accesibilidad
      // (aria-describedby) que puede no coincidir entre el render de servidor y
      // el de cliente en Next.js, produciendo un warning de hydration mismatch.
      id="pipeline-kanban"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex snap-x gap-4 overflow-x-auto pb-4">
        {columnas.map((columna) => (
          <KanbanColumn
            key={columna.etapa}
            etapa={columna.etapa}
            label={columna.label}
            color={columna.color}
            cards={columna.oportunidades}
            isOver={etapaSobre === columna.etapa}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
          />
        ))}
      </div>

      <DragOverlay>{activeCard && <KanbanCard {...activeCard} className="rotate-2 shadow-xl" />}</DragOverlay>
    </DndContext>
  );
}
