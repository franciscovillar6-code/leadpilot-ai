import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { analyzeInquiry } from "@/lib/analyze-lead.functions";
import type { Lead } from "@/lib/leads";

export function NewInquiryDialog({
  onClose,
  onAnalyzed,
}: {
  onClose: () => void;
  onAnalyzed: (lead: Lead) => void;
}) {
  const runAnalysis = useServerFn(analyzeInquiry);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.name.trim().length < 1 || form.message.trim().length < 10) {
      toast.error("Ingresá el nombre y una consulta de al menos 10 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const analysis = await runAnalysis({ data: form });
      const lead: Lead = {
        id: `ai-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim() || "no informado",
        phone: form.phone.trim() || "no informado",
        destination: analysis.destination,
        travelers: analysis.travelers,
        tripType: analysis.tripType,
        startDate: analysis.startDate,
        endDate: analysis.endDate,
        budget: analysis.budget,
        score: analysis.score,
        priority: analysis.priority,
        intent: analysis.intent,
        intentLevel: analysis.intentLevel,
        customerInfo: analysis.customerInfo,
        scoreReason: analysis.scoreReason,
        scoreFactors: analysis.scoreFactors,
        missingInfo: analysis.missingInfo,
        nextAction: analysis.nextAction,
        suggestedResponse: analysis.suggestedResponse,
        analyzedByAi: true,
      };
      onAnalyzed(lead);
      toast.success(`Análisis completado — score ${analysis.score}/100`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo analizar la consulta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px]"
        onClick={loading ? undefined : onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-label="Nueva consulta"
        className="animate-fade-up fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
      >
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary">
              <Sparkles className="size-3" />
              Análisis con IA
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Nueva consulta</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Pegá la consulta del cliente y la IA la analiza con la rúbrica de scoring.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="grid size-8 place-items-center rounded-full transition-colors hover:bg-muted disabled:opacity-40"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Nombre" value={form.name} onChange={update("name")} required />
            <Field label="Email" value={form.email} onChange={update("email")} />
            <Field label="Teléfono" value={form.phone} onChange={update("phone")} />
          </div>
          <div>
            <label
              htmlFor="inquiry-message"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Consulta del cliente
            </label>
            <textarea
              id="inquiry-message"
              value={form.message}
              onChange={(e) => update("message")(e.target.value)}
              rows={6}
              maxLength={4000}
              placeholder="Hola, somos 2 personas y queremos viajar a Roma en marzo. Tenemos unos USD 4.000 y necesitamos cotización..."
              className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-border bg-card py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-muted disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex flex-[2] items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Analizando…
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" /> Analizar con IA
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        type="text"
        value={value}
        required={required}
        maxLength={255}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
