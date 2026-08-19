import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const supabaseUrl = process.env["SUPABASE_URL"];
          const supabaseSecretKey = process.env["SUPABASE_SECRET_KEY"];

          if (!supabaseUrl || !supabaseSecretKey) {
            throw new Error("Faltan variables de entorno de Supabase");
          }

          const response = await fetch(
            `${supabaseUrl}/rest/v1/leads?select=*&order=created_at.desc`,
            {
              headers: {
                apikey: supabaseSecretKey,
                Authorization: `Bearer ${supabaseSecretKey}`,
              },
            },
          );

          const rows = await response.json();

          if (!response.ok) {
            console.error("Error leyendo Supabase:", rows);
            throw new Error("No se pudieron obtener los leads");
          }

          const leads = rows
            .filter((row: any) => row.ai_analysis)
            .map((row: any) => {
              const ai = row.ai_analysis ?? {};
              const answers = row.answers ?? {};

              const findAnswer = (...terms: string[]) => {
                const key = Object.keys(answers).find((currentKey) => {
                  const normalized = currentKey.toLowerCase();
                  return terms.some((term) =>
                    normalized.includes(term.toLowerCase()),
                  );
                });

                if (!key) return "";

                const value = answers[key];

                return Array.isArray(value)
                  ? value.join(" ")
                  : String(value ?? "");
              };

              return {
                id: String(row.id),

                name:
                  findAnswer("nombre viajero principal", "nombre") ||
                  "Sin nombre",

                email:
                  findAnswer("mail de contacto", "email", "correo") || "",

                phone:
                  findAnswer("wpp de contacto", "whatsapp", "telefono") || "",

                destination:
                  ai.destination ||
                  findAnswer("tipo de cotización", "destino") ||
                  "Sin definir",

                travelers: Number(ai.travelers ?? 0),

                tripType: ai.tripType || "Sin definir",

                startDate: ai.startDate || "",

                endDate: ai.endDate || "",

                budget: Number(ai.budget ?? 0),

                score: Number(row.score ?? ai.score ?? 0),

                priority:
                  row.priority === "high" ||
                  row.priority === "medium" ||
                  row.priority === "low"
                    ? row.priority
                    : "low",

                intent: ai.intent || "Sin analizar",

                customerInfo: ai.customerInfo || "",

                scoreReason: ai.scoreReason || "",

                missingInfo: Array.isArray(ai.missingInfo)
                  ? ai.missingInfo
                  : [],

                nextAction: ai.nextAction || "",

                suggestedResponse: ai.suggestedResponse || "",

                intentLevel:
                  ai.intentLevel === "high" ||
                  ai.intentLevel === "medium" ||
                  ai.intentLevel === "low"
                    ? ai.intentLevel
                    : undefined,

                scoreFactors: Array.isArray(ai.scoreFactors)
                  ? ai.scoreFactors
                  : [],

                analyzedByAi: true,
              };
            });

          return Response.json({
            success: true,
            leads,
          });
        } catch (error) {
          console.error("Error obteniendo leads:", error);

          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "No se pudieron obtener los leads",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});