import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";;
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Download,
  Plus,
  X,
  Plane,
  Users,
  Calendar,
  Wallet,
  TrendingUp,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";

import { leads as mockLeads, type Lead } from "@/lib/leads";
import { NewInquiryDialog } from "@/components/new-inquiry-dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeadPilot AI — Dashboard" },
      {
        name: "description",
        content:
          "Dashboard de LeadPilot AI para visualizar y priorizar leads de viajes con scoring automático.",
      },
      {
        property: "og:title",
        content: "LeadPilot AI — Dashboard",
      },
      {
        property: "og:description",
        content:
          "Dashboard de LeadPilot AI para visualizar y priorizar leads de viajes con scoring automático.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const priorityLabel: Record<Lead["priority"], string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const priorityScoreLabel = (score: number) => {
  if (score >= 85) return "Score > 85";
  if (score >= 60) return "Score 60-84";
  return "Score < 60";
};

const budgetFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const safeFormat = (value: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return format(parsed, "dd MMM", { locale: es }).toUpperCase();
};

const dateRange = (start: string, end: string) => {
  const startFmt = safeFormat(start);
  const endFmt = safeFormat(end);
  if (!startFmt && !endFmt) return "SIN FECHA";
  if (!endFmt) return startFmt!;
  if (!startFmt) return endFmt;
  return `${startFmt} — ${endFmt}`;
};

function ScoreBadge({ score, priority }: { score: number; priority: Lead["priority"] }) {
  const colorClasses = {
    high: "bg-status-high-subtle text-status-high-subtle-foreground ring-status-high/20",
    medium: "bg-status-medium-subtle text-status-medium-subtle-foreground ring-status-medium/20",
    low: "bg-status-low-subtle text-status-low-subtle-foreground ring-status-low/20",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded-md text-xs font-extrabold tabular-nums ring-1 ${colorClasses[priority]}`}
    >
      {score}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Lead["priority"] }) {
  const classes = {
    high: "bg-status-high text-status-high-foreground",
    medium: "bg-status-medium text-status-medium-foreground",
    low: "bg-status-low text-status-low-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase rounded-[4px] ${classes[priority]}`}
    >
      <span className="size-1.5 rounded-full bg-white/80" />
      {priorityLabel[priority]}
    </span>
  );
}

function MetricCard({
  label,
  value,
  subtitle,
  accent,
  delay,
}: {
  label: string;
  value: string;
  subtitle: string;
  accent?: "neutral" | "rose" | "amber" | "slate";
  delay: number;
}) {
  const valueClasses = {
    neutral: "text-foreground",
    rose: "text-status-high",
    amber: "text-status-medium",
    slate: "text-status-low",
  };

  return (
    <div
      className="animate-fade-up bg-card p-5 rounded-xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p
        className={`text-3xl font-extrabold tracking-tighter ${valueClasses[accent ?? "neutral"]}`}
      >
        {value}
      </p>
      <p className="mt-2 text-[10px] font-mono text-muted-foreground">{subtitle}</p>
    </div>
  );
}
function LeadDetailPanel({
  lead,
  onClose,
  onApprove,
}: {
  lead: Lead;
  onClose: () => void;
  onApprove: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="animate-slide-in-right fixed right-0 top-0 z-50 h-screen w-full sm:w-[480px] bg-card shadow-[-20px_0_60px_rgba(0,0,0,0.1)] border-l border-border flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">
              Análisis del lead
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">{lead.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="size-8 inline-flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Cerrar panel"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Score reasoning */}
          <div className="p-4 rounded-lg bg-status-high-subtle border border-status-high/10">
            <h3 className="text-xs font-bold text-status-high uppercase tracking-wider mb-2">
              Razonamiento IA: {lead.score}/100
            </h3>
            <p className="text-sm text-status-high-subtle-foreground leading-relaxed italic">
              "{lead.scoreReason}"
            </p>
          </div>

          {/* Score factors */}
          {lead.scoreFactors && lead.scoreFactors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Factores del score
              </h4>
              <ul className="space-y-2">
                {lead.scoreFactors.map((factor) => (
                  <li
                    key={factor.criterion}
                    className="flex items-start gap-2 p-3 border border-border rounded-lg bg-muted/50"
                  >
                    {factor.impact === "positive" ? (
                      <ArrowUp className="size-3.5 mt-0.5 text-intent-strong" />
                    ) : (
                      <ArrowDown className="size-3.5 mt-0.5 text-status-high" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{factor.criterion}</span>
                        <span
                          className={`text-xs font-mono font-semibold ${
                            factor.impact === "positive" ? "text-intent-strong" : "text-status-high"
                          }`}
                        >
                          {factor.impact === "positive" ? "+" : "−"}
                          {factor.points}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{factor.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Customer info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Información del cliente
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-border rounded-lg bg-muted/50">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Email
                </div>
                <div className="text-sm font-medium flex items-center gap-1.5 mt-1">
                  <Mail className="size-3.5 text-muted-foreground" />
                  <span className="truncate">{lead.email}</span>
                </div>
              </div>
              <div className="p-3 border border-border rounded-lg bg-muted/50">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Teléfono
                </div>
                <div className="text-sm font-medium flex items-center gap-1.5 mt-1">
                  <Phone className="size-3.5 text-muted-foreground" />
                  <span className="truncate">{lead.phone}</span>
                </div>
              </div>
              <div className="p-3 border border-border rounded-lg bg-muted/50">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Destino
                </div>
                <div className="text-sm font-medium flex items-center gap-1.5 mt-1">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  <span className="truncate">{lead.destination}</span>
                </div>
              </div>
              <div className="p-3 border border-border rounded-lg bg-muted/50">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Intención
                </div>
                <div className="text-sm font-medium text-intent-strong flex items-center gap-1.5 mt-1">
                  <TrendingUp className="size-3.5" />
                  <span className="truncate">{lead.intent}</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{lead.customerInfo}</p>
          </div>

          {/* Trip summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 border border-border rounded-lg bg-muted/50">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                <Users className="size-3" /> Viajeros
              </div>
              <div className="text-sm font-medium mt-1">{lead.travelers}</div>
            </div>
            <div className="p-3 border border-border rounded-lg bg-muted/50">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                <Calendar className="size-3" /> Fechas
              </div>
              <div className="text-sm font-medium mt-1">
                {dateRange(lead.startDate, lead.endDate)}
              </div>
            </div>
            <div className="p-3 border border-border rounded-lg bg-muted/50">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                <Wallet className="size-3" /> Presupuesto
              </div>
              <div className="text-sm font-medium mt-1">{budgetFormatter.format(lead.budget)}</div>
            </div>
          </div>

          {/* Missing info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Información que falta
            </h4>
            <ul className="text-sm space-y-2">
              {lead.missingInfo.map((item) => (
                <li key={item} className="flex items-center gap-2 text-status-high">
                  <AlertCircle className="size-3.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Next action */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Próxima acción recomendada
            </h4>
            <div className="p-3 border border-primary/20 bg-primary/5 rounded-lg text-sm text-primary font-medium">
              <CheckCircle2 className="inline-block size-4 mr-1.5 -mt-0.5" />
              {lead.nextAction}
            </div>
          </div>

          {/* Suggested response */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Respuesta sugerida para el cliente
            </h4>
            <div className="p-4 border border-border rounded-xl bg-muted/50 text-sm text-foreground relative">
              <p className="italic text-muted-foreground mb-4 leading-relaxed whitespace-pre-wrap">
                {lead.suggestedResponse}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(lead.suggestedResponse)}
                className="w-full py-2 bg-foreground text-primary-foreground rounded-md text-xs font-semibold hover:bg-foreground/90 transition-colors"
              >
                Copiar borrador
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-card border border-border rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors"
          >
            Cerrar
          </button>
          <button
  onClick={onApprove}
  className="flex-[2] py-3 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
>
  Aprobar lead
</button>
</div>
    </aside>
  </>
);
}

function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingLead, setPendingLead] = useState<Lead | null>(null);

 
  
  
    useEffect(() => {
      const loadLeads = async () => {
        try {
          const response = await fetch("/api/leads");
          const data = await response.json();
    
          if (!response.ok || !data.success) {
            throw new Error(data.message || "No se pudieron cargar los leads");
          }
    
          setLeads(data.leads);
        } catch (error) {
          console.error("Error cargando leads:", error);
          setLeads([]);
        }
      };
    
      loadLeads();
    }, []);
    const sortedLeads = useMemo(() => {
      return leads
        .filter((lead) =>
          lead.destination.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => b.score - a.score);
    }, [leads, query]);
    
    const totals = useMemo(() => {
      return {
        total: leads.length,
        high: leads.filter((l) => l.priority === "high").length,
        medium: leads.filter((l) => l.priority === "medium").length,
        low: leads.filter((l) => l.priority === "low").length,
      };
    }, [leads]);

  const handleAnalyzed = (lead: Lead) => {
    setDialogOpen(false);
    setPendingLead(lead);
    setSelectedLead(lead);
  };
  
  const handleApproveLead = () => {
    if (!pendingLead) return;
  
    setLeads((prev) => [pendingLead, ...prev]);
    setPendingLead(null);
    setSelectedLead(null);
  };


  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-primary grid place-items-center">
                <div className="size-2 rounded-full bg-primary-foreground animate-pulse-soft" />
              </div>
              <span className="text-sm font-extrabold tracking-tighter uppercase">
                LeadPilot <span className="text-primary">AI</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <span className="text-sm font-medium text-foreground">Dashboard</span>
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Cola
              </span>
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Análisis
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-muted ring-1 ring-foreground/5" />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1400px] p-6 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Plane className="size-4" />
              <span>Empresa de viajes</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-balance">Panel de leads</h1>
            <p className="text-sm text-muted-foreground">
              Priorización automática de consultas de potenciales clientes
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-card border border-border rounded-md shadow-sm hover:bg-muted transition-colors">
              <Download className="size-3.5" />
              Exportar CSV
            </button>
            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-3.5" />
              Nueva consulta
            </button>
          </div>
        </header>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total de leads"
            value={totals.total.toString()}
            subtitle="Leads activos en el sistema"
            accent="neutral"
            delay={0}
          />
          <MetricCard
            label="Prioridad alta"
            value={totals.high.toString()}
            subtitle={priorityScoreLabel(90)}
            accent="rose"
            delay={60}
          />
          <MetricCard
            label="Prioridad media"
            value={totals.medium.toString()}
            subtitle={priorityScoreLabel(70)}
            accent="amber"
            delay={120}
          />
          <MetricCard
            label="Prioridad baja"
            value={totals.low.toString()}
            subtitle={priorityScoreLabel(50)}
            accent="slate"
            delay={180}
          />
        </div>

        {/* Lead table */}
        <section
          className="animate-fade-up bg-card rounded-xl border border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
          style={{ animationDelay: "240ms" }}
        >
          <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/50">
            <h2 className="text-sm font-semibold">
              Cola activa{" "}
              <span className="ml-2 text-[10px] font-mono font-normal text-muted-foreground uppercase tracking-tighter px-2 py-0.5 bg-card border border-border rounded">
                Ordenado por Score
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-primary" />
              <input
                type="text"
                placeholder="Filtrar por destino..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-xs px-3 py-1.5 border border-border rounded-md bg-card focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <th className="px-6 py-3 border-b border-border">Lead</th>
                  <th className="px-6 py-3 border-b border-border">Destino</th>
                  <th className="px-6 py-3 border-b border-border">Viajeros</th>
                  <th className="px-6 py-3 border-b border-border">Fecha estimada</th>
                  <th className="px-6 py-3 border-b border-border text-right">Presupuesto</th>
                  <th className="px-6 py-3 border-b border-border text-center">Score</th>
                  <th className="px-6 py-3 border-b border-border">Prioridad</th>
                  <th className="px-6 py-3 border-b border-border">Intención</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.tripType}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{lead.destination}</td>
                    <td className="px-6 py-4 text-sm">{lead.travelers}</td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      {dateRange(lead.startDate, lead.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-right font-medium text-foreground">
                      {budgetFormatter.format(lead.budget)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ScoreBadge score={lead.score} priority={lead.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={lead.priority} />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{lead.intent}</td>
                  </tr>
                ))}
                {sortedLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      No se encontraron leads para "{query}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Detail panel */}
      {selectedLead && (
     <LeadDetailPanel
     lead={selectedLead}
     onClose={() => setSelectedLead(null)}
     onApprove={handleApproveLead}
   />)}

      {/* New AI inquiry */}
      {dialogOpen && (
        <NewInquiryDialog onClose={() => setDialogOpen(false)} onAnalyzed={handleAnalyzed} />
      )}
    </div>
  );
}
