"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enviarMensaje, getMensajes } from "@/lib/actions/chat.actions";
import { USUARIOS_DISPONIBLES, useUsuarioActualStore } from "@/store/usuarioActualStore";
import type { Mensaje } from "@/types";

const INTERVALO_POLLING_MS = 3000;

function nombreDe(usuarioId: string): string {
  return USUARIOS_DISPONIBLES.find((u) => u.id === usuarioId)?.nombre ?? "Usuario";
}

export default function ChatPage() {
  const { usuario } = useUsuarioActualStore();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelado = false;

    async function refrescar() {
      try {
        const datos = await getMensajes();
        if (!cancelado) setMensajes(datos);
      } catch (error) {
        console.error("[chat] No se pudieron cargar los mensajes:", error);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    refrescar();
    const intervalo = setInterval(refrescar, INTERVALO_POLLING_MS);
    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, []);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    const contenido = texto.trim();
    if (!contenido || enviando) return;

    setEnviando(true);
    setTexto("");
    try {
      const nuevo = await enviarMensaje({ usuario_id: usuario.id, contenido });
      setMensajes((prev) => [...prev, nuevo]);
    } catch (error) {
      console.error("[chat] No se pudo enviar el mensaje:", error);
      setTexto(contenido); // devolver el texto para que no se pierda
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Chat de Equipo</h1>
        <p className="text-sm text-muted-foreground">Canal general — todo el equipo ve estos mensajes.</p>
      </div>

      <div className="mt-4 flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {cargando ? (
            <p className="text-center text-sm text-muted-foreground">Cargando mensajes...</p>
          ) : mensajes.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Todavía no hay mensajes. Sé el primero en escribir.</p>
          ) : (
            mensajes.map((mensaje) => (
              <ChatMessage
                key={mensaje.id}
                nombre={nombreDe(mensaje.usuario_id)}
                contenido={mensaje.contenido}
                fecha={mensaje.created_at}
                esPropio={mensaje.usuario_id === usuario.id}
              />
            ))
          )}
          <div ref={finRef} />
        </div>

        <form onSubmit={handleEnviar} className="flex items-center gap-2 border-t border-border p-3">
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={`Escribe como ${usuario.nombre}...`}
            disabled={enviando}
            maxLength={2000}
          />
          <Button type="submit" size="icon" disabled={enviando || !texto.trim()} aria-label="Enviar mensaje">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
