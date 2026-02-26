import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

type CountryRisk = {
  country: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  complianceScore: number;
};

const countries = [
  { name: "India", code: "IND" },
  { name: "USA", code: "USA" },
  { name: "China", code: "CHN" },
  { name: "Germany", code: "DEU" },
  { name: "Japan", code: "JPN" },
  { name: "Russia", code: "RUS" },
  { name: "Brazil", code: "BRA" },
  { name: "South Africa", code: "ZAF" },
];

const riskConfig = {
  low: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: ShieldCheck, label: "Low" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: AlertTriangle, label: "Medium" },
  high: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: ShieldAlert, label: "High" },
  critical: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle, label: "Critical" },
};

export default function RiskAssessment() {
  const [data, setData] = useState<CountryRisk[]>([]);
  const [loading, setLoading] = useState(true);

  const getRiskLevel = (score: number) => {
    if (score > 0.75) return "critical";
    if (score > 0.55) return "high";
    if (score > 0.35) return "medium";
    return "low";
  };

  useEffect(() => {
    async function fetchRisks() {
      try {
        const results = await Promise.all(
          countries.map(async (c) => {
            const res = await fetch("http://localhost:8000/macro-risk", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ country_code: c.code }),
            });

            const json = await res.json();

            const level = getRiskLevel(json.risk_score);

            return {
              country: c.name,
              riskLevel: level as CountryRisk["riskLevel"],
              complianceScore: Math.round((1 - json.risk_score) * 100),
            };
          })
        );

        setData(results);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchRisks();
  }, []);

  if (loading) {
    return (
      <div className="mt-14 text-sm text-muted-foreground animate-pulse">
        Crunching macroeconomic indicators... please hold.
      </div>
    );
  }

  return (
    <div className="mt-14 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
        Country <span className="text-gradient-gold">Risk Assessment</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Model-driven geopolitical vulnerability scoring based on live macroeconomic indicators.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((c) => {
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
                    <h3 className="font-display font-semibold text-foreground text-lg">
                      {c.country}
                    </h3>
                    <span className={`text-xs font-medium ${cfg.color}`}>
                      {cfg.label} Risk
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Compliance</p>
                  <p className={`font-display text-xl font-bold ${cfg.color}`}>
                    {c.complianceScore}%
                  </p>
                </div>
              </div>

              <div className="mb-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    c.riskLevel === "low"
                      ? "bg-emerald-400"
                      : c.riskLevel === "medium"
                      ? "bg-yellow-400"
                      : c.riskLevel === "high"
                      ? "bg-orange-400"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${c.complianceScore}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}