# CRM Seguimiento Comercial

Gestión de clientes y oportunidades para contadores colombianos.

## Tech Stack

- Next.js 15 + React 19 + TypeScript (modo estricto)
- Tailwind CSS + Shadcn/UI + Lucide Icons
- Supabase (PostgreSQL + Auth + Storage) — Row Level Security como capa de autorización
- Drizzle ORM (schema-as-code y migraciones)
- Zustand, React Hook Form + Zod, dnd-kit, Recharts

## Setup

1. Clona el repo
2. `npm install`
3. `cp .env.example .env.local` y completa las variables (URL/keys de Supabase y `DATABASE_URL`)
4. `npm run dev`
5. Accede a http://localhost:3000

## Base de datos

El schema vive en [`src/lib/db/schema.ts`](src/lib/db/schema.ts) (única fuente de verdad — los tipos en `src/types` y los enums usados por los schemas de Zod se derivan de ahí).

```bash
npm run db:generate   # genera migración SQL a partir del schema
npm run db:migrate    # aplica migraciones pendientes a DATABASE_URL
npm run db:studio     # explorador visual de la base de datos
```

Después de migrar, hay que configurar manualmente las políticas de Row Level Security en Supabase (ver blueprint de arquitectura, §6.2) — no las genera Drizzle.

## Desarrollo

- `npm run dev` — servidor de desarrollo
- `npm run build` — compilación de producción
- `npm run lint` — validación de ESLint/TypeScript

## Próximas fases

- **Fase 2:** Dashboard + componentes UI (Sidebar, Topbar, widgets)
- **Fase 3:** Módulo Clientes CRUD + políticas RLS
- **Fase 4:** Seguimiento (Timeline) + creación automática de tareas
