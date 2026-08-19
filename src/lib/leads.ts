import type { ScoreFactor } from "./scoring";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelers: number;
  tripType: string;
  startDate: string;
  endDate: string;
  budget: number;
  score: number;
  priority: "high" | "medium" | "low";
  intent: string;
  customerInfo: string;
  scoreReason: string;
  missingInfo: string[];
  nextAction: string;
  suggestedResponse: string;
  /** Presente en leads analizados por IA */
  intentLevel?: "high" | "medium" | "low";
  scoreFactors?: ScoreFactor[];
  analyzedByAi?: boolean;
}

export const leads: Lead[] = [
  {
    id: "lp-001",
    name: "Julián Rossi",
    email: "julian.rossi@email.com",
    phone: "+54 11 4123 4567",
    destination: "Kioto, Japón",
    travelers: 4,
    tripType: "Familia",
    startDate: "2026-10-12",
    endDate: "2026-10-28",
    budget: 18500,
    score: 98,
    priority: "high",
    intent: "Listo para reservar",
    customerInfo:
      "Familia de 4 personas que viaja por primera vez a Japón. Buscan una experiencia de lujo cultural con estancias en ryokans boutique y tours privados.",
    scoreReason:
      "Alto presupuesto por viajero, ventana de viaje definida y corta, y alta intención de compra demostrada. Han solicitado itinerarios de lujo en Japón previamente.",
    missingInfo: [
      "Preferencia de aerolínea",
      "Restricciones alimentarias específicas",
      "Edades de los niños",
    ],
    nextAction: "Agendar llamada de concierge VIP para asignación de hotel de lujo.",
    suggestedResponse:
      "Hola Julián, vi que están planificando un viaje familiar a Kioto para octubre. Acabo de ver disponibilidad en una villa privada del Aman Kyoto para esas fechas exactas. ¿Podemos agendar una breve llamada esta semana para ajustar los detalles?",
  },
  {
    id: "lp-002",
    name: "Elena Vance",
    email: "elena.vance@email.com",
    phone: "+1 312 555 0192",
    destination: "Costa Amalfitana, Italia",
    travelers: 2,
    tripType: "Luna de miel",
    startDate: "2026-06-05",
    endDate: "2026-06-15",
    budget: 12000,
    score: 94,
    priority: "high",
    intent: "Inmediato",
    customerInfo:
      "Pareja en luna de miel. Buscan una experiencia romántica de 10 días con hoteles boutique, cenas privadas y traslados en lancha.",
    scoreReason:
      "Presupuesto elevado para dos viajeros, destino de alto valor y lenguaje de urgencia en la consulta. Solicitaron disponibilidad para junio.",
    missingInfo: ["Preferencia de zona (Positano vs Ravello)", "Clase de vuelo deseada"],
    nextAction: "Enviar propuesta de hoteles boutique con vista al mar y cenas privadas.",
    suggestedResponse:
      "Hola Elena, felicidades por su próxima luna de miel. Tengo dos opciones de suites con vista al mar en Positano que encajan perfectamente con sus fechas. ¿Prefieren algo más íntimo en Ravello o la energía de Positano?",
  },
  {
    id: "lp-003",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    destination: "Bali, Indonesia",
    travelers: 2,
    tripType: "Retiro de bienestar",
    startDate: "2026-11-03",
    endDate: "2026-11-12",
    budget: 5800,
    score: 91,
    priority: "high",
    intent: "Listo para reservar",
    customerInfo:
      "Pareja interesada en un retiro de bienestar de 9 días. Buscan spa, yoga y alimentación saludable en Ubud y costa sur.",
    scoreReason:
      "Consulta muy enfocada con fechas y presupuesto claros. El destino y el tipo de viaje tienen alto margen de conversión.",
    missingInfo: [
      "Nivel de hotel deseado (boutique vs resort)",
      "Preferencia de actividades de aventura",
    ],
    nextAction: "Enviar paquete de bienestar con opciones de resort y boutique hotel.",
    suggestedResponse:
      "Hola Priya, Bali es ideal para un retiro de bienestar en noviembre. Tengo una combinación de 5 noches en Ubud y 4 en la costa sur con spa y clases de yoga incluidas. ¿Les gustaría recibir el itinerario?",
  },
  {
    id: "lp-004",
    name: "David Thorne",
    email: "david.thorne@email.com",
    phone: "+44 20 7946 0958",
    destination: "Alpes Suizos",
    travelers: 4,
    tripType: "Grupo de ski",
    startDate: "2026-01-10",
    endDate: "2026-01-18",
    budget: 16500,
    score: 87,
    priority: "high",
    intent: "Alta intención",
    customerInfo:
      "Grupo de 4 amigos experimentados en ski. Buscan un chalet privado cerca de Zermatt o Verbier con acceso directo a pistas.",
    scoreReason:
      "Presupuesto alto y destino de temporada alta. El grupo tiene experiencia previa en viajes de ski, lo que reduce fricción de venta.",
    missingInfo: [
      "Nivel de ski de cada participante",
      "Preferencia de resort (Zermatt vs Verbier)",
    ],
    nextAction: "Confirmar disponibilidad de chalets privados para las fechas solicitadas.",
    suggestedResponse:
      "Hola David, para su grupo de ski en enero tengo dos chalets privados con acceso directo a pistas. Uno en Zermatt y otro en Verbier. ¿Qué resort prefieren para priorizar opciones?",
  },
  {
    id: "lp-005",
    name: "Marcus Thorne",
    email: "marcus.thorne@email.com",
    phone: "+1 415 555 0134",
    destination: "Patagonia, Chile",
    travelers: 1,
    tripType: "Solo / Lujo",
    startDate: "2026-12-20",
    endDate: "2027-01-05",
    budget: 9400,
    score: 82,
    priority: "medium",
    intent: "Alta intención",
    customerInfo:
      "Viajero solo que busca una experiencia de aventura de lujo en Patagonia. Interesado en trekking, glaciares y lodges remotos.",
    scoreReason:
      "Presupuesto sólido para un solo viajero y destino de alto valor. Las fechas durante las fiestas aumentan la urgencia.",
    missingInfo: ["Nivel físico para trekking", "Preferencia de lodge (Chile vs Argentina)"],
    nextAction: "Enviar itinerario de aventura de lujo con lodges exclusivos.",
    suggestedResponse:
      "Hola Marcus, Patagonia en diciembre es una experiencia inolvidable. Tengo un itinerario de 17 días que combina Torres del Paine con El Calafate y lodges remotos. ¿Te interesa recibirlo?",
  },
  {
    id: "lp-006",
    name: "Sofia Rossi",
    email: "sofia.rossi@email.com",
    phone: "+39 06 1234 5678",
    destination: "Santorini, Grecia",
    travelers: 2,
    tripType: "Luna de miel",
    startDate: "2026-05-08",
    endDate: "2026-05-16",
    budget: 8200,
    score: 80,
    priority: "medium",
    intent: "Alta intención",
    customerInfo:
      "Pareja que busca una luna de miel relajada en Santorini con hotel con piscina privada y atardeceres.",
    scoreReason:
      "Presupuesto adecuado para el destino y fechas en temporada media. La consulta incluye detalles específicos de hotel.",
    missingInfo: ["Vuelos desde qué ciudad", "Preferencia de hotel calificada"],
    nextAction: "Presentar 3 opciones de hoteles con piscina privada en Oia.",
    suggestedResponse:
      "Hola Sofia, Santorini en mayo es perfecto para una luna de miel. Tengo tres hoteles en Oia con piscina privada y vistas al atardecer. ¿Desde qué ciudad estarían volando?",
  },
  {
    id: "lp-007",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@email.com",
    phone: "+61 2 9374 8000",
    destination: "Reikiavik, Islandia",
    travelers: 6,
    tripType: "Viaje en grupo",
    startDate: "2026-02-14",
    endDate: "2026-02-21",
    budget: 22000,
    score: 78,
    priority: "medium",
    intent: "Planeando",
    customerInfo:
      "Grupo de 6 amigos interesados en auroras boreales, geysers y experiencias naturales. Viaje de invierno de una semana.",
    scoreReason:
      "Alto presupuesto total y grupo numeroso, pero aún están en fase de planificación y no tienen fechas de vuelo definidas.",
    missingInfo: ["Distribución de habitaciones", "Vuelos de origen", "Nivel de actividad física"],
    nextAction: "Enviar propuesta de grupo con alojamiento y excursiones de auroras.",
    suggestedResponse:
      "Hola Sarah, Islandia en febrero ofrece grandes chances de ver auroras boreales. Tengo un paquete grupal para 6 personas con guía privado y caza de auroras. ¿Les gustaría recibirlo?",
  },
  {
    id: "lp-008",
    name: "Liam O'Connor",
    email: "liam.oconnor@email.com",
    phone: "+353 1 234 5678",
    destination: "Ciudad del Cabo, Sudáfrica",
    travelers: 3,
    tripType: "Aventura",
    startDate: "2026-08-15",
    endDate: "2026-08-25",
    budget: 7200,
    score: 73,
    priority: "medium",
    intent: "Planeando",
    customerInfo:
      "Familia de 3 personas interesada en safari, gastronomía y paisajes costeros. Buscan una experiencia combinada de 10 días.",
    scoreReason:
      "Presupuesto razonable y destino atractivo, pero la consulta es amplia y falta definir prioridades entre safari y ciudad.",
    missingInfo: ["Edad del hijo/a", "Preferencia de duración de safari", "Presupuesto de vuelos"],
    nextAction: "Enviar itinerario combinado de safari, viñedos y costa.",
    suggestedResponse:
      "Hola Liam, Ciudad del Cabo con safari es una combinación excelente para agosto. Tengo una propuesta de 10 días que incluye 3 noches de safari y 7 en la costa. ¿Cuánto tiempo les gustaría dedicar al safari?",
  },
  {
    id: "lp-009",
    name: "Yuki Tanaka",
    email: "yuki.tanaka@email.com",
    phone: "+81 3 1234 5678",
    destination: "París, Francia",
    travelers: 2,
    tripType: "Aniversario",
    startDate: "2026-09-22",
    endDate: "2026-09-29",
    budget: 6500,
    score: 67,
    priority: "medium",
    intent: "Investigando",
    customerInfo:
      "Pareja celebrando aniversario. Buscan una semana romántica en París con museos, cenas especiales y día de compras.",
    scoreReason:
      "Presupuesto moderado y destino popular. La consulta es general y no muestra urgencia inmediata.",
    missingInfo: ["Número de aniversario", "Preferencia de barrio", "Restricciones dietéticas"],
    nextAction: "Enviar propuesta de 7 días con museos, cena en crucero y barrio recomendado.",
    suggestedResponse:
      "Hola Yuki, París en septiembre es encantador. Tengo una propuesta de 7 días con museos, una cena en crucero por el Sena y un día de compras. ¿Es un aniversario especial?",
  },
  {
    id: "lp-010",
    name: "Thomas Müller",
    email: "thomas.muller@email.com",
    phone: "+49 30 1234 5678",
    destination: "Berlín, Alemania",
    travelers: 2,
    tripType: "Extensión de negocios",
    startDate: "2026-09-10",
    endDate: "2026-09-14",
    budget: 4200,
    score: 54,
    priority: "low",
    intent: "Investigando",
    customerInfo:
      "Viajero de negocios que quiere extender su estancia 4 días con acompañante. Busca alojamiento céntrico y tours históricos.",
    scoreReason:
      "Presupuesto limitado y viaje corto. La consulta es funcional y no indica intención de compra premium.",
    missingInfo: ["Hotel actual para coordinar traslado", "Días exactos de negocios vs turismo"],
    nextAction: "Enviar opciones de hoteles céntricos y tours de medio día.",
    suggestedResponse:
      "Hola Thomas, Berlín tiene mucho para ver en una extensión corta. Le puedo armar un paquete de 4 días con hotel céntrico y tours históricos. ¿En qué hotel se hospedará por negocios?",
  },
  {
    id: "lp-011",
    name: "Roberto Sánchez",
    email: "roberto.sanchez@email.com",
    phone: "+52 55 1234 5678",
    destination: "Cancún, México",
    travelers: 3,
    tripType: "Familia",
    startDate: "2026-07-20",
    endDate: "2026-07-27",
    budget: 4800,
    score: 52,
    priority: "low",
    intent: "Casual",
    customerInfo:
      "Familia de 3 que busca una semana de playa en Cancún. No tienen preferencias específicas de hotel ni actividades.",
    scoreReason:
      "Presupuesto ajustado y consulta genérica. La falta de especificaciones reduce el score de priorización.",
    missingInfo: [
      "Edad del hijo/a",
      "Preferencia todo incluido vs plan europeo",
      "Vuelos de origen",
    ],
    nextAction: "Enviar 2 opciones de resorts todo incluido para familias.",
    suggestedResponse:
      "Hola Roberto, para una semana familiar en Cancún en julio les recomiendo un resort todo incluido. ¿Prefieren algo frente al mar con actividades para niños o algo más tranquilo?",
  },
  {
    id: "lp-012",
    name: "Linda Zhao",
    email: "linda.zhao@email.com",
    phone: "+1 604 555 0187",
    destination: "Vancouver, Canadá",
    travelers: 1,
    tripType: "Solo",
    startDate: "2026-10-05",
    endDate: "2026-10-12",
    budget: 3200,
    score: 47,
    priority: "low",
    intent: "Investigando",
    customerInfo:
      "Viajera sola que busca una semana en Vancouver para otoño. Interesada en naturaleza, mercados y gastronomía local.",
    scoreReason:
      "Presupuesto bajo para un viaje internacional de una semana. La consulta está en etapa muy temprana de investigación.",
    missingInfo: [
      "Origen de vuelos",
      "Preferencia de alojamiento",
      "Interés en excursiones a Whistler",
    ],
    nextAction: "Enviar guía de opciones de alojamiento económico y tours de día.",
    suggestedResponse:
      "Hola Linda, Vancouver en octubre es hermoso con los colores de otoño. Tengo opciones de alojamiento céntrico y tours de día a las Montañas del Norte. ¿Desde dónde estarías volando?",
  },
];
