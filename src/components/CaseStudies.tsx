import { caseStudies } from "@/lib/sanctionData";
import { BookOpen, TrendingDown, CheckCircle2, AlertTriangle } from "lucide-react";

const sectorColors: Record<string, string> = {
  Defence: "text-red-400 bg-red-500/10",
  Energy: "text-amber-400 bg-amber-500/10",
  Finance: "text-blue-400 bg-blue-500/10",
  Technology: "text-violet-400 bg-violet-500/10",
};

const CaseStudies = () => {
  return (
    <div className="mt-14 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
        Real-World <span className="text-gradient-gold">Case Studies</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-6">Major sanctions events and their documented impact on India's economy, trade, and strategic interests.</p>

      <div className="space-y-4">
        {caseStudies.map((cs, i) => {
          const sectorStyle = sectorColors[cs.sector] || "text-primary bg-primary/10";
          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">{cs.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sectorStyle}`}>{cs.sector}</span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{cs.year}</span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{cs.summary}</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Impact</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cs.impact}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Outcome</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cs.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseStudies;
