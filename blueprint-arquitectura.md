# Blueprint de Arquitectura — CRM Seguimiento Comercial

> Documento de planeación técnica. Sin código de implementación — define decisiones, estructura y contratos que guiarán el desarrollo.

---

## 0. Decisiones de Stack y Justificación

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 15 (App Router)** + React 19 + TypeScript estricto | SSR/RSC reduce JS en cliente para un CRM data-heavy; Server Actions eliminan boilerplate de API REST para mutaciones CRUD |
| UI | Tailwind CSS + Shadcn/UI + Lucide Icons | Ya definido en el PRD; Shadcn da control total del código (no es una dependencia de caja negra), ideal para theming Azul/Verde/Rojo/Gris custom |
| Base de datos | **PostgreSQL vía Supabase** | Row Level Security (RLS) resuelve de forma nativa "Auxiliar ve solo sus clientes asignados" sin duplicar lógica de autorización en cada query; incluye Auth, Storage y Realtime en la misma plataforma |
| Autenticación | Supabase Auth (email/password, cookies httpOnly) | Evita construir auth desde cero; se integra directo con RLS vía `auth.uid()` |
| Acceso a datos | **Supabase JS Client** para todo el CRUD orientado a usuario (respeta RLS automáticamente al reenviar el JWT) + **Drizzle ORM** solo para *schema-as-code*, migraciones versionadas y queries de reportería compleja en servidor | Evita el problema clásico de "ORM con conexión directa bypassa RLS": el cliente Supabase es quien products la sesión del usuario a Postgres |
| Validación | Zod (schemas compartidos cliente/servidor) | Un solo contrato de datos reusado en formularios y Server Actions |
| Formularios | react-hook-form + @hookform/resolvers/zod | Estándar de facto con Shadcn |
| Estado servidor/cliente | React Server Components + Server Actions para la mayoría; **TanStack Query** solo en vistas altamente interactivas (Kanban, Calendario) que necesitan optimistic updates | No sobre-ingenierizar: la mayoría de pantallas son listar/crear/editar |
| Drag & drop | dnd-kit | Accesible, ligero, sin dependencias de jQuery legacy |
| Calendario | Componente propio sobre `date-fns` (no FullCalendar) | Control total de estilo para mantener identidad visual Notion/Linear; FullCalendar es pesado y difícil de re-skinnear |
| Gráficas (Reportes) | Recharts | Se integra de forma nativa con los bloques de charts de Shadcn |
| Storage de archivos | Supabase Storage (buckets por tipo, políticas espejo de RLS) | Cotizaciones, contratos, adjuntos de seguimiento |
| Notificaciones en vivo | Supabase Realtime + tabla `notificaciones` | Alertas del dashboard y badges de tareas vencidas sin polling |
| Fechas/Zona horaria | `date-fns` + locale `es`, timezone fija `America/Bogota` | Audiencia 100% colombiana |
| Despliegue | Vercel (app) + Supabase Cloud (datos) | Next.js nativo en Vercel; sin gestión de infraestructura |

---

## 1. Mapa de Navegación

```
/                                   → redirect según sesión
/login                              → autenticación (público)

(app) — requiere sesión, layout con Sidebar + Topbar
│
├── /dashboard                      → widgets, alertas, pipeline value, actividad reciente
│
├── /clientes                       → listado (tabla filtrable: estado, prioridad, responsable)
│   ├── /clientes/nuevo             → formulario alta
│   └── /clientes/[id]              → ficha completa (tabs internos, sin cambiar de ruta)
│       ├── tab: Información         (datos generales + fiscales)
│       ├── tab: Oportunidades       (lista de oportunidades del cliente)
│       ├── tab: Seguimiento         (timeline estilo Notion)
│       ├── tab: Tareas              (tareas asociadas)
│       └── tab: Documentos          (cotizaciones, contratos, facturas...)
│       └── /clientes/[id]/editar   → formulario edición
│
├── /oportunidades                  → listado global (todas las oportunidades, filtrable)
│   └── /oportunidades/[id]         → detalle (valor, probabilidad, valor esperado, cliente)
│
├── /pipeline                       → Kanban (Prospecto→...→Ganado/Perdido), drag & drop
│
├── /tareas                         → listado + filtros (mías / equipo si admin, vencidas, hoy)
│   └── /tareas/[id]                → detalle / edición rápida (o modal, sin ruta dedicada)
│
├── /calendario                     → vistas Mensual | Semanal | Diaria (?vista=)
│
├── /documentos                     → vista global cross-cliente, filtrable por tipo
│
├── /reportes                       → selector de reporte
│   └── /reportes/[tipo]            → clientes-nuevos | activos | pipeline | conversion |
│                                      seguimientos | usuarios-activos
│
├── /perfil                         → datos propios, cambio de contraseña
│
└── /configuracion                  → SOLO ADMIN (guard adicional en layout)
    ├── /configuracion/usuarios     → CRUD de usuarios (crear/eliminar auxiliares)
    └── /configuracion/empresa      → datos de la firma, catálogos (tipos, prioridades)

/api/
├── /api/uploads                    → firma de URLs para Supabase Storage
├── /api/reportes/[tipo]/export     → export CSV/PDF de reportes
└── /api/cron/tareas-vencidas       → job diario: recalcula alertas de tareas vencidas
```

**Navegación mobile-first:** sidebar colapsa a bottom-nav de 5 íconos (Dashboard, Clientes, Pipeline, Tareas, Más) en `< 768px`; el resto de rutas quedan accesibles desde el menú "Más".

---

## 2. Modelo de Datos Detallado

### 2.1 Diagrama de relaciones

```
organizaciones ──┬──< users
                  ├──< clientes ──┬──< oportunidades
                  │                ├──< seguimientos ──< adjuntos
                  │                ├──< tareas
                  │                └──< documentos
                  └──< notificaciones

users ──< clientes.responsable_id
users ──< oportunidades.responsable_id
users ──< seguimientos.usuario_id
users ──< tareas.responsable_id
users ──< actividad_log.usuario_id

seguimientos ──> tareas   (tarea "próximo paso" generada automáticamente)
```

### 2.2 Entidades

**`organizaciones`** *(nueva — ver §7 Gaps)*
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | |
| nombre | text | Razón social de la firma contable |
| nit | text | |
| plan | enum(`trial`,`basico`,`pro`) | Preparación para modelo SaaS multi-firma |
| created_at | timestamptz | |

**`users`**
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | = `auth.users.id` de Supabase |
| organizacion_id | uuid, FK | |
| email | text, unique | |
| nombre | text | |
| avatar_url | text, nullable | |
| telefono | text, nullable | |
| rol | enum(`admin`,`auxiliar`) | |
| activo | boolean, default true | soft-disable en vez de borrar |
| created_at | timestamptz | |

**`clientes`**
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | |
| organizacion_id | uuid, FK | |
| empresa | text | |
| nombre_contacto | text | |
| email | text, nullable | |
| telefono | text, nullable | |
| whatsapp | text, nullable | |
| ciudad | text | |
| departamento | text | |
| nit | text, nullable | |
| regimen_tributario | text, nullable | Info fiscal |
| revisor_fiscal | text, nullable | Info fiscal |
| estado | enum(`prospecto`,`primer_contacto`,`reunion`,`propuesta`,`negociacion`,`cliente_activo`,`perdido`) | |
| prioridad | enum(`baja`,`media`,`alta`) | |
| responsable_id | uuid, FK → users | Auxiliar asignado |
| observaciones | text, nullable | |
| fecha_ultimo_contacto | timestamptz, nullable | Denormalizado, actualizado por trigger al crear seguimiento |
| created_at | timestamptz | |
| deleted_at | timestamptz, nullable | soft delete (trazabilidad contable) |

**`oportunidades`**
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | |
| cliente_id | uuid, FK | |
| nombre | text | |
| descripcion | text, nullable | |
| valor_estimado | numeric(14,2) | |
| moneda | enum(`COP`,`USD`), default `COP` | |
| probabilidad | integer (0–100) | % |
| valor_esperado | numeric(14,2), **columna generada** | `valor_estimado * probabilidad / 100` — calculado en DB, no en app |
| etapa | enum(`prospecto`,`primer_contacto`,`reunion`,`propuesta`,`negociacion`,`ganado`,`perdido`) | Columna del Kanban |
| motivo_perdida | text, nullable | Requerido si etapa = perdido |
| fecha_cierre_estimada | date | |
| responsable_id | uuid, FK → users | |
| created_at | timestamptz | |

**`seguimientos`**
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | |
| cliente_id | uuid, FK | |
| tipo | enum(`llamada`,`whatsapp`,`correo`,`reunion`,`nota`,`cotizacion`,`contrato`,`archivo`) | |
| descripcion | text | |
| resultado | text, nullable | |
| duracion_minutos | integer, nullable | Solo aplica a llamada/reunión |
| usuario_id | uuid, FK → users | Quién registró |
| tarea_generada_id | uuid, FK → tareas, nullable | Vínculo al "próximo paso" |
| created_at | timestamptz | |

**`adjuntos`** *(nueva — reemplaza el `archivo_url` único del PRD)*
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | |
| seguimiento_id | uuid, FK, nullable | |
| documento_id | uuid, FK, nullable | |
| url | text | Ruta en Supabase Storage |
| nombre_original | text | |
| mime_type | text | |
| tamano_bytes | integer | |
| created_at | timestamptz | |

**`tareas`**
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | |
| titulo | text | |
| descripcion | text, nullable | |
| cliente_id | uuid, FK, nullable | Puede ser tarea sin cliente |
| responsable_id | uuid, FK → users | |
| fecha_vencimiento | timestamptz | |
| recordatorio_at | timestamptz, nullable | |
| prioridad | enum(`baja`,`media`,`alta`) | |
| estado | enum(`pendiente`,`en_progreso`,`completada`,`cancelada`) | |
| completada_at | timestamptz, nullable | |
| created_at | timestamptz | |

**`documentos`**
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | |
| cliente_id | uuid, FK | |
| tipo | enum(`cotizacion`,`contrato`,`factura`,`propuesta`,`acta`) | |
| nombre | text | |
| url | text | Storage path |
| uploaded_by | uuid, FK → users | |
| created_at | timestamptz | |

**`notificaciones`** *(nueva)*
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK | Destinatario |
| tipo | enum(`tarea_vencida`,`reunion_hoy`,`asignacion`,`mencion`) | |
| referencia_id | uuid, nullable | id de tarea/cliente relacionado |
| leida | boolean, default false | |
| created_at | timestamptz | |

**`actividad_log`** *(nueva — auditoría)*
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid, PK | |
| usuario_id | uuid, FK | |
| entidad | text | `cliente`, `oportunidad`, `tarea`... |
| entidad_id | uuid | |
| accion | enum(`crear`,`editar`,`eliminar`,`cambio_estado`) | |
| detalle | jsonb, nullable | diff antes/después |
| created_at | timestamptz | |

### 2.3 Reglas de negocio a nivel de datos
- `valor_esperado` es columna generada (`GENERATED ALWAYS AS`) — nunca se calcula ni se confía en el cliente.
- Trigger: al insertar un `seguimiento`, actualizar `clientes.fecha_ultimo_contacto`.
- Trigger/lógica de aplicación: cuando `oportunidades.etapa` pasa a `ganado`, sincronizar `clientes.estado = 'cliente_activo'`; si pasa a `perdido` y es la única oportunidad abierta, sincronizar `clientes.estado = 'perdido'`.
- `oportunidades.motivo_perdida` obligatorio cuando `etapa = 'perdido'` (constraint `CHECK`).

---

## 3. Estructura de Carpetas (Next.js App Router)

```
crm-seguimiento/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx              # layout minimal, sin sidebar
│   │   │   └── login/page.tsx
│   │   │
│   │   ├── (app)/
│   │   │   ├── layout.tsx              # guard de sesión + Sidebar/Topbar
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── clientes/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nuevo/page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx        # ficha con tabs internos
│   │   │   │       └── editar/page.tsx
│   │   │   ├── oportunidades/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── pipeline/page.tsx
│   │   │   ├── tareas/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── calendario/page.tsx
│   │   │   ├── documentos/page.tsx
│   │   │   ├── reportes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [tipo]/page.tsx
│   │   │   ├── perfil/page.tsx
│   │   │   └── configuracion/
│   │   │       ├── layout.tsx          # guard adicional: solo admin
│   │   │       ├── usuarios/page.tsx
│   │   │       └── empresa/page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── uploads/route.ts
│   │   │   ├── reportes/[tipo]/export/route.ts
│   │   │   └── cron/tareas-vencidas/route.ts
│   │   │
│   │   ├── layout.tsx                  # root layout (fonts, providers)
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                         # primitivos shadcn (button, dialog, ...)
│   │   ├── layout/                     # AppSidebar, AppTopbar, MobileBottomNav
│   │   ├── dashboard/                  # StatCard, PipelineValueWidget, AlertsFeed
│   │   ├── clientes/                   # ClienteForm, ClienteFichaHeader, ClienteTabs
│   │   ├── oportunidades/              # OportunidadForm, OportunidadCard
│   │   ├── pipeline/                   # KanbanBoard, KanbanColumn, KanbanCard
│   │   ├── seguimiento/                # Timeline, TimelineItem, SeguimientoForm
│   │   ├── tareas/                     # TaskList, TaskItem, TaskQuickCreate
│   │   ├── calendario/                 # MonthView, WeekView, DayView, EventPopover
│   │   ├── documentos/                 # DocumentoList, DocumentoUploader
│   │   ├── reportes/                   # ChartCard, ReportFilterBar
│   │   └── shared/                     # DataTable, EstadoBadge, EmptyState, ComboboxCliente
│   │
│   ├── lib/
│   │   ├── db/                         # schema.ts (Drizzle), client.ts
│   │   ├── supabase/                   # client.ts, server.ts, middleware.ts
│   │   ├── auth/                       # session.ts, rbac.ts (helpers can(), requireRole())
│   │   ├── validations/                # cliente.schema.ts, oportunidad.schema.ts, ...
│   │   ├── actions/                    # server actions agrupadas por módulo
│   │   │   ├── clientes.actions.ts
│   │   │   ├── oportunidades.actions.ts
│   │   │   ├── seguimientos.actions.ts
│   │   │   └── tareas.actions.ts
│   │   └── utils/                      # cn(), formatCurrency(), formatDate()
│   │
│   ├── hooks/                          # useKanbanDnd, useOptimisticTareas
│   ├── types/                          # tipos derivados de Zod/DB
│   └── middleware.ts                   # protección de rutas a nivel edge
│
├── drizzle/                            # migraciones SQL versionadas
├── public/
└── (config: next.config.ts, tailwind.config.ts, tsconfig.json, .env.example)
```

---

## 4. Componentes Principales Reutilizables

| Componente | Usado en | Responsabilidad |
|---|---|---|
| `DataTable` | Clientes, Tareas, Documentos, Oportunidades | Tabla genérica: sort, filtros, paginación, column visibility |
| `EstadoBadge` | Clientes, Oportunidades, Tareas | Pill de color según estado (mapea paleta azul/verde/rojo/gris) |
| `PriorityBadge` | Clientes, Tareas | Indicador visual de prioridad |
| `StatCard` | Dashboard | Widget numérico con ícono, delta y link |
| `EmptyState` | Todas las listas | Estado vacío consistente con CTA |
| `ComboboxCliente` | Oportunidades, Tareas, Seguimiento | Buscador tipo-ahead de clientes |
| `UserAssigneeSelect` | Clientes, Tareas, Oportunidades | Selector de responsable (filtrado por rol) |
| `ConfirmDialog` | Eliminar cliente/usuario | Confirmación destructiva reutilizable |
| `Timeline` / `TimelineItem` | Ficha de cliente | Renderiza `seguimientos` orden cronológico, estilo Notion |
| `SeguimientoForm` | Ficha de cliente | Form con selector de tipo + campo condicional "¿próximo paso?" que dispara creación de tarea |
| `KanbanBoard` / `KanbanColumn` / `KanbanCard` | `/pipeline` | dnd-kit, actualiza `oportunidades.etapa` on drop |
| `CalendarMonthView` / `WeekView` / `DayView` | `/calendario` | Agrega reuniones, llamadas, tareas y recordatorios en una sola grilla |
| `TaskQuickCreate` | Global (topbar / seguimiento) | Modal rápido de creación de tarea |
| `DocumentoUploader` | Ficha de cliente, Documentos | Drag-drop upload a Supabase Storage con progreso |
| `ChartCard` | Reportes, Dashboard | Wrapper de Recharts con título, filtros y export |
| `AppSidebar` / `MobileBottomNav` | Layout global | Navegación responsive, oculta ítems según rol |
| `CommandPalette` (⌘K) | Layout global | Búsqueda rápida cross-entidad (clientes, tareas) — recomendado, no en PRD original |

---

## 5. Flujo de Usuarios

### 5.1 Administrador (Contador Principal)

```
Login
  │
  ▼
Dashboard (vista global: TODOS los clientes/usuarios)
  │
  ├──► Clientes (ve y edita cualquier cliente, reasigna responsable)
  ├──► Pipeline (vista completa del equipo)
  ├──► Reportes (clientes nuevos, conversión, usuarios activos)
  ├──► Configuración
  │      ├──► Usuarios → crear auxiliar (invita por email) / desactivar
  │      └──► Empresa → catálogos, datos de la firma
  └──► Tareas (propias + del equipo, puede reasignar)
```

### 5.2 Auxiliar Comercial (Asistente)

```
Login
  │
  ▼
Dashboard (scoped: solo SUS clientes asignados)
  │
  ├──► Clientes → Nuevo cliente (queda auto-asignado a sí mismo)
  │        │
  │        ▼
  │      Ficha de cliente
  │        │
  │        ▼
  │      Registrar seguimiento (llamada, WhatsApp, reunión...)
  │        │
  │        ▼
  │      "¿Cuál es el próximo paso?" ──► Sí ──► Tarea creada automáticamente
  │        │                                        │
  │        No                                       ▼
  │        │                                   Aparece en /tareas y /calendario
  │        ▼
  │      Continúa timeline
  │
  ├──► Pipeline (drag & drop solo de SUS oportunidades)
  ├──► Tareas (solo las suyas)
  └──► Calendario (sus eventos)

  ✗ Sin acceso a: /configuracion, clientes de otros auxiliares, reportes de usuarios
```

---

## 6. Patrones de Seguridad

### 6.1 Autenticación y sesión
- Supabase Auth con cookies `httpOnly`, `secure`, `SameSite=Lax`.
- `src/middleware.ts` intercepta toda ruta bajo `(app)`: sin sesión válida → redirect a `/login`. Corre en Edge Runtime, antes de renderizar cualquier Server Component.

### 6.2 Autorización — defensa en profundidad (3 capas)
1. **UI**: el Sidebar/rutas ocultan opciones que el rol no debería ver (cosmético, no es seguridad real).
2. **Server Actions / Route Handlers**: cada acción vuelve a validar `rol` y pertenencia (`responsable_id === session.user.id`) antes de tocar la base de datos — **nunca confiar en lo que envía el cliente**.
3. **Row Level Security (Postgres)** — la capa que realmente garantiza el aislamiento, incluso ante un bug de aplicación:
   ```
   Política clientes.select:
     rol = 'admin'  OR  responsable_id = auth.uid()

   Política clientes.insert:
     auxiliar solo puede insertar con responsable_id = auth.uid()
     (o el valor que el admin asigne explícitamente)

   Política clientes.delete:
     solo rol = 'admin'

   Políticas de oportunidades / seguimientos / tareas / documentos:
     heredan el acceso vía JOIN a clientes.responsable_id
   ```
   Estas políticas viven en la base de datos, no en el código de la app — se aplican aunque una request llegue por un endpoint nuevo que alguien olvidó proteger.

### 6.3 Storage de archivos
- Buckets de Supabase Storage con convención de rutas `clientes/{cliente_id}/{tipo}/{filename}`.
- Políticas de bucket espejo de las políticas RLS de `clientes`.
- URLs firmadas con expiración corta para descarga; validación de `mime_type` y tamaño máximo antes de aceptar el upload.

### 6.4 Validación de entrada
- Todo Server Action valida payload con Zod antes de ejecutar cualquier query — mismo schema reusado en el formulario del cliente.

### 6.5 Otros controles
- **Rate limiting** en `/login` y endpoints de exportación (Upstash Ratelimit) para mitigar fuerza bruta / scraping de reportes.
- **CSRF**: mitigado de forma nativa por Server Actions (Next.js exige same-origin) + cookies `SameSite`.
- **Secrets**: `SUPABASE_SERVICE_ROLE_KEY` solo se usa server-side (jobs de cron, exports), nunca se expone al bundle de cliente.
- **Auditoría**: tabla `actividad_log` registra crear/editar/eliminar/cambio de estado por usuario — trazabilidad exigible en un entorno contable.
- **Datos personales**: NIT, teléfono, email caen bajo la Ley 1581 de 2012 (Habeas Data) — se recomienda aviso de tratamiento de datos en el registro de clientes y política de retención antes de implementar borrado físico (por eso `deleted_at` en vez de `DELETE`).

---

## 7. Brechas del PRD y Recomendaciones del Arquitecto

| Brecha detectada | Recomendación |
|---|---|
| PRD no contempla multi-firma | Agregar `organizaciones` desde el día 1 aunque el MVP sea single-tenant — evita una migración de datos dolorosa si el producto escala a más de una firma contable |
| `seguimientos.archivo_url` es un solo campo | Modelar `adjuntos` como tabla propia (1-a-muchos) — un seguimiento de tipo "reunión" suele generar varios archivos |
| `clientes.estado` y el Kanban de `oportunidades` tienen columnas casi idénticas pero no están explícitamente sincronizados en el PRD | Definir regla explícita: el estado del cliente se deriva del estado de sus oportunidades activas (trigger o lógica en Server Action) |
| No hay tabla de notificaciones ni auditoría | Agregadas (`notificaciones`, `actividad_log`) — necesarias para "alertas automáticas" del dashboard y trazabilidad contable |
| No se especifica borrado de clientes/datos | Usar soft delete (`deleted_at`) por requisitos de trazabilidad típicos del sector contable |
| No se menciona búsqueda | Agregar Command Palette (⌘K) global — encaja con la inspiración de diseño (Linear/Notion) y es de bajo costo con Postgres full-text search |

---

*Siguiente paso sugerido: validar este blueprint contigo antes de generar schema de base de datos (Drizzle) y los primeros componentes.*
