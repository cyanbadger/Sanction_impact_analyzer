import { countryRiskData, type CountryRisk } from "@/lib/sanctionData";
import { ShieldAlert, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

const riskConfig: Record<CountryRisk["riskLevel"], { color: string; bg: string; border: string; icon: typeof ShieldAlert; label: string }> = {
  low: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: ShieldCheck, label: "Low" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: AlertTriangle, label: "Medium" },
  high: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: ShieldAlert, label: "High" },
  critical: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle, label: "Critical" },
};

const RiskAssessment = () => {
  return (
    <div className="mt-14 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
        Country <span className="text-gradient-gold">Risk Assessment</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-6">Color-coded risk levels with real-time compliance scoring — focused on India's strategic partners and adversaries.</p>
      
      <div className="grid gap-4 md:grid-cols-2">
        {countryRiskData.map((c) => {
          const cfg = riskConfig[c.riskLevel];
          const Icon = cfg.icon;
          return (
            <div
              key={c.country}
              className={`group rounded-xl border ${cfg.border} bg-card p-5 transition-all duration-300 hover:glow-gold`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${cfg.bg}`}>
                    <Icon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">{c.country}</h3>
                    <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label} Risk • {c.sanctionCount} sanctions</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Compliance</p>
                  <p className={`font-display text-xl font-bold ${cfg.color}`}>{c.complianceScore}%</p>
                </div>
              </div>
              {/* Compliance bar */}
              <div className="mb-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    c.riskLevel === "low" ? "bg-emerald-400" :
                    c.riskLevel === "medium" ? "bg-yellow-400" :
                    c.riskLevel === "high" ? "bg-orange-400" : "bg-red-400"
                  }`}
                  style={{ width: `${c.complianceScore}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.impactOnIndia}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskAssessment;
