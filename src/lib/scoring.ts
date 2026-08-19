export interface ScoreFactor {
  criterion: string;
  impact: "positive" | "negative";
  points: number;
  detail: string;
}

export interface LeadAnalysis {
  score: number;
  priority: "high" | "medium" | "low";
  intentLevel: "high" | "medium" | "low";
  intent: string;
  destination: string;
  travelers: number;
  startDate: string;
  endDate: string;
  budget: number;
  customerInfo: string;
  scoreReason: string;
  scoreFactors: ScoreFactor[];
  missingInfo: string[];
  nextAction: string;
  suggestedResponse: string;
}

/**
 * Rúbrica explícita de scoring (100 puntos).
 * Se envía al modelo para que el score sea consistente y auditable.
 */
export const SCORING_RUBRIC = `
RÚBRICA DE SCORING (0 a 100). Sumá los puntos de cada criterio:

1. Fechas del viaje definidas — hasta 18 pts
   18: fechas exactas o rango cerrado. 9: mes o temporada aproximada. 0: sin fechas.
2. Destino definido — hasta 15 pts
   15: destino concreto (ciudad/país). 8: región amplia o varias opciones. 0: sin destino.
3. Cantidad de viajeros definida — hasta 12 pts
   12: número exacto. 6: rango aproximado. 0: no informado.
4. Presupuesto definido — hasta 18 pts
   18: monto claro y coherente con el destino. 9: rango o indicio de gasto. 0: sin presupuesto.
5. Cercanía de la fecha del viaje — hasta 15 pts
   15: dentro de los próximos 3 meses. 10: 3 a 6 meses. 5: 6 a 12 meses. 2: más de 12 meses o indefinido.
6. Claridad de lo que el cliente busca — hasta 12 pts
   12: tipo de viaje, estilo y expectativas claras. 6: parcialmente claro. 0: consulta vaga.
7. Señales de intención concreta de compra — hasta 10 pts
   10: pide cotización, disponibilidad, quiere reservar o menciona urgencia.
   5: interés genuino sin pedido concreto. 0: solo curiosidad o consulta informativa.

PRIORIDAD: score >= 85 -> "high"; 60 a 84 -> "medium"; menor a 60 -> "low".
INTENCIÓN DE COMPRA: basada en el criterio 7 más la cercanía de fechas y el presupuesto.
  "high" si hay pedido concreto de cotización/reserva; "medium" si hay interés claro sin pedido; "low" si es exploratorio.

Los puntos otorgados deben sumar exactamente el score final.
Devolvé en scoreFactors un ítem por cada criterio evaluado, indicando cuántos puntos aportó
(impact "positive") o cuántos puntos se perdieron respecto del máximo (impact "negative", points = puntos perdidos).
`.trim();
