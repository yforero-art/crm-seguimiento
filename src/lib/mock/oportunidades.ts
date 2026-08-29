import type { KanbanOportunidad } from "@/components/pipeline/KanbanCard";
import { RESPONSABLE_ANDRES, RESPONSABLE_CAMILA, RESPONSABLE_YESENIA } from "@/lib/mock/responsables";

const RESPONSABLES_ROTACION = [RESPONSABLE_YESENIA.nombre, RESPONSABLE_ANDRES.nombre, RESPONSABLE_CAMILA.nombre];

interface OportunidadSeed {
  titulo: string;
  empresa: string;
  valor: number;
  probabilidad: number;
  etapa: KanbanOportunidad["etapa"];
}

// TODO(Fase 4): reemplazar por getOportunidades() (Server Action + RLS).
// 40 oportunidades ficticias repartidas en las 7 etapas del pipeline.
const SEEDS: OportunidadSeed[] = [
  // Prospecto (8)
  { titulo: "Juan Pérez", empresa: "Tech Solutions Colombia", valor: 800_000, probabilidad: 10, etapa: "prospecto" },
  { titulo: "Laura Gómez", empresa: "Consultoría Empresarial", valor: 600_000, probabilidad: 15, etapa: "prospecto" },
  { titulo: "Carlos López", empresa: "Startup XYZ", valor: 400_000, probabilidad: 10, etapa: "prospecto" },
  { titulo: "Camila Rojas", empresa: "Inversiones del Norte", valor: 550_000, probabilidad: 15, etapa: "prospecto" },
  { titulo: "Felipe Torres", empresa: "Comercializadora Andina", valor: 700_000, probabilidad: 10, etapa: "prospecto" },
  { titulo: "Natalia Vargas", empresa: "Grupo Empresarial Sur", valor: 450_000, probabilidad: 10, etapa: "prospecto" },
  { titulo: "Ricardo Molina", empresa: "Innovación Digital SAS", valor: 650_000, probabilidad: 15, etapa: "prospecto" },
  { titulo: "Daniela Rincón", empresa: "Import Export Colombia", valor: 500_000, probabilidad: 10, etapa: "prospecto" },

  // Primer Contacto (7)
  { titulo: "Pedro Ramírez", empresa: "Industrial Metals", valor: 1_200_000, probabilidad: 25, etapa: "primer_contacto" },
  { titulo: "Rosa Martínez", empresa: "Servicios Logísticos", valor: 950_000, probabilidad: 25, etapa: "primer_contacto" },
  { titulo: "Julián Ortiz", empresa: "Textiles del Caribe", valor: 780_000, probabilidad: 25, etapa: "primer_contacto" },
  { titulo: "Marcela Bravo", empresa: "Agroindustrial Valle", valor: 1_100_000, probabilidad: 25, etapa: "primer_contacto" },
  { titulo: "Esteban Cárdenas", empresa: "Constructora Bolívar", valor: 900_000, probabilidad: 20, etapa: "primer_contacto" },
  { titulo: "Viviana Castaño", empresa: "Papelería Nacional", valor: 650_000, probabilidad: 25, etapa: "primer_contacto" },
  { titulo: "Mauricio Peña", empresa: "Repuestos Andinos", valor: 850_000, probabilidad: 20, etapa: "primer_contacto" },

  // Reunión (6)
  { titulo: "Diego Ruiz", empresa: "Construcciones Andina", valor: 1_500_000, probabilidad: 40, etapa: "reunion" },
  { titulo: "María Gómez", empresa: "Retail Plus", valor: 800_000, probabilidad: 40, etapa: "reunion" },
  { titulo: "Alejandro Duarte", empresa: "Clínica Vida Sana", valor: 1_300_000, probabilidad: 45, etapa: "reunion" },
  { titulo: "Paula Restrepo", empresa: "Muebles del Hogar", valor: 700_000, probabilidad: 40, etapa: "reunion" },
  { titulo: "Sergio Nieto", empresa: "Transportes Rápidos", valor: 1_100_000, probabilidad: 40, etapa: "reunion" },
  { titulo: "Isabel Franco", empresa: "Editorial Colombia", valor: 600_000, probabilidad: 35, etapa: "reunion" },

  // Propuesta (8)
  { titulo: "Juan García", empresa: "Alpha Ambulancias", valor: 2_400_000, probabilidad: 60, etapa: "propuesta" },
  { titulo: "Sofia López", empresa: "Restaurantes Unidos", valor: 1_800_000, probabilidad: 60, etapa: "propuesta" },
  { titulo: "Andrés Fajardo", empresa: "Seguridad Total Ltda", valor: 1_600_000, probabilidad: 55, etapa: "propuesta" },
  { titulo: "Catalina Mesa", empresa: "Farmacéutica del Norte", valor: 2_100_000, probabilidad: 60, etapa: "propuesta" },
  { titulo: "Julián Herrera", empresa: "Ingeniería Sostenible", valor: 1_900_000, probabilidad: 65, etapa: "propuesta" },
  { titulo: "Valentina Reyes", empresa: "Hotel Boutique Central", valor: 1_400_000, probabilidad: 55, etapa: "propuesta" },
  { titulo: "Felipe Zambrano", empresa: "Grupo Automotriz Andino", valor: 2_200_000, probabilidad: 60, etapa: "propuesta" },
  { titulo: "Manuela Ríos", empresa: "Cadena de Gimnasios Fit", valor: 1_300_000, probabilidad: 55, etapa: "propuesta" },

  // Negociación (6)
  { titulo: "Claudia Herrera", empresa: "Distribuidora La Sabana", valor: 3_200_000, probabilidad: 75, etapa: "negociacion" },
  { titulo: "Andrea Peña", empresa: "Fashion Group", valor: 2_100_000, probabilidad: 75, etapa: "negociacion" },
  { titulo: "Iván Salazar", empresa: "Constructora del Pacífico", valor: 2_800_000, probabilidad: 80, etapa: "negociacion" },
  { titulo: "Diana Cortés", empresa: "Colegio Nuevo Horizonte", valor: 1_900_000, probabilidad: 75, etapa: "negociacion" },
  { titulo: "Óscar Medina", empresa: "Aseguradora Confianza", valor: 3_500_000, probabilidad: 70, etapa: "negociacion" },
  { titulo: "Liliana Aguirre", empresa: "Cementos del Sur", valor: 2_600_000, probabilidad: 75, etapa: "negociacion" },

  // Ganado (3)
  { titulo: "Pedro López", empresa: "X-Data Colombia", valor: 2_800_000, probabilidad: 100, etapa: "ganado" },
  { titulo: "Miguel Ángel", empresa: "Auditoría Plus", valor: 1_900_000, probabilidad: 100, etapa: "ganado" },
  { titulo: "Andrés Salcedo", empresa: "Textiles Cartagena", valor: 1_500_000, probabilidad: 100, etapa: "ganado" },

  // Perdido (2)
  { titulo: "Admin", empresa: "Proyecto Cancelado", valor: 600_000, probabilidad: 0, etapa: "perdido" },
  { titulo: "Admin", empresa: "Sin interés", valor: 400_000, probabilidad: 0, etapa: "perdido" },
];

export const OPORTUNIDADES_INICIALES: KanbanOportunidad[] = SEEDS.map((seed, index) => ({
  id: `o0000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  titulo: seed.titulo,
  empresa: seed.empresa,
  valor: seed.valor,
  probabilidad: seed.probabilidad,
  etapa: seed.etapa,
  responsable: RESPONSABLES_ROTACION[index % RESPONSABLES_ROTACION.length]!,
  moneda: "COP",
}));
