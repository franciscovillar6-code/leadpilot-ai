import { createFileRoute } from "@tanstack/react-router";
import { runInquiryAnalysis } from "../lib/analyze-lead.server";
export const Route = createFileRoute("/api/google-form")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const supabaseUrl = process.env["SUPABASE_URL"];
          const supabaseSecretKey = process.env["SUPABASE_SECRET_KEY"];

          if (!supabaseUrl || !supabaseSecretKey) {
            throw new Error("Faltan variables de entorno de Supabase");
          }

          const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
            method: "POST",
            headers: {
              apikey: supabaseSecretKey,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              form_row: body.row,
              received_at: body.receivedAt,
              answers: body.answers,
              status: "pending",
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error("Error de Supabase:", result);
            throw new Error("No se pudo guardar el lead en Supabase");
          }

          console.log("Lead guardado en Supabase:", result);
          const savedLead = result[0];

          try {
            const answers = body.answers ?? {};
          
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
          
            const name =
              findAnswer("nombre viajero principal", "nombre") ||
              "Sin nombre";
          
            const email =
              findAnswer("mail de contacto", "email", "correo") || "";
          
            const phone =
              findAnswer("wpp de contacto", "whatsapp", "teléfono", "telefono") || "";
          
            const message = Object.entries(answers)
              .map(([question, value]) => {
                const answer = Array.isArray(value)
                  ? value.join(", ")
                  : String(value ?? "");
          
                return `${question}: ${answer}`;
              })
              .join("\n");
          
            const analysis = await runInquiryAnalysis({
              name,
              email,
              phone,
              message,
            });
          
            const updateResponse = await fetch(
              `${supabaseUrl}/rest/v1/leads?id=eq.${savedLead.id}`,
              {
                method: "PATCH",
                headers: {
                  apikey: supabaseSecretKey,
                  "Content-Type": "application/json",
                  Prefer: "return=representation",
                },
                body: JSON.stringify({
                  score: analysis.score,
                  priority: analysis.priority,
                  ai_analysis: analysis,
                }),
              },
            );
          
            const updatedLead = await updateResponse.json();
          
            if (!updateResponse.ok) {
              console.error("Error actualizando análisis:", updatedLead);
              throw new Error("El lead se guardó, pero no se pudo guardar el análisis");
            }
          
            console.log("Lead analizado por Gemini:", updatedLead);
          
            return Response.json({
              success: true,
              message: "Consulta guardada y analizada correctamente",
              lead: updatedLead[0],
            });
          } catch (analysisError) {
            console.error("Error analizando el lead:", analysisError);
          
            return Response.json({
              success: true,
              message: "Consulta guardada, pero el análisis de IA falló",
              lead: savedLead,
              aiAnalyzed: false,
            });
          }
          
        } catch (error) {
          console.error("Error recibiendo Google Form:", error);

          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "No se pudo procesar la consulta",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});