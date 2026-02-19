import { useState } from "react";
import { sanctionEntities, type SanctionEntity } from "@/lib/sanctionData";
import { Search, Building2, User, Ship, Landmark, ChevronDown, ChevronUp, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { analyzeSanction } from "../api";

const typeIcons: Record<SanctionEntity["type"], typeof Building2> = {
  Organisation: Building2,
  Individual: User,
  Vessel: Ship,
  Bank: Landmark,
};

const SanctionSearch = () => {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filtered = sanctionEntities.filter((e) => {
    const matchesQuery = !query || e.name.toLowerCase().includes(query.toLowerCase()) || e.country.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === "All" || e.type === typeFilter;
    return matchesQuery && matchesType;
  });

  const goldColor = "hsl(36, 100%, 60%)";
  const saffronColor = "hsl(30, 100%, 50%)";
  const mutedGold = "hsl(36, 80%, 40%)";
  function mapEntityToPolicy(entity: SanctionEntity) {
    return {
      severity: entity.status === "Active" ? 0.9 : 0.3,
      financial: entity.type === "Bank" ? 1 : 0,
      trade: entity.type === "Organisation" ? 1 : 0,
      technology: entity.reason.toLowerCase().includes("technology") ? 1 : 0,
      energy: entity.reason.toLowerCase().includes("oil") ? 1 : 0,
      issuer_strength: 0.7,
      binding: 1,
    };
  }


  return (
    <div className="mt-14 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
        Sanction <span className="text-gradient-gold">Search</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-6">Screen entities against global sanction lists instantly — see how each impacts India.</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entity name or country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="All">All Types</option>
          <option value="Organisation">Organisations</option>
          <option value="Bank">Banks</option>
          <option value="Individual">Individuals</option>
          <option value="Vessel">Vessels</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((e, i) => {
          const TypeIcon = typeIcons[e.type];
          const isExpanded = expandedIndex === i;
          const data = e.impactData;
          const gdpDelta = data[data.length - 1].gdpAfter - data[0].gdpBefore;
          const tradeDelta = ((data[data.length - 1].tradeAfter - data[0].tradeBefore) / data[0].tradeBefore * 100);
          const fdiDelta = ((data[data.length - 1].fdiAfter - data[0].fdiBefore) / data[0].fdiBefore * 100);

          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                      <TypeIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{e.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{e.type}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{e.country}</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">{e.list}</span>
                        <span className={`rounded-full px-2 py-0.5 font-medium ${
                          e.status === "Active" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {e.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{e.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Added: {e.addedDate}</span>
                    <button
                      onClick={async () => {
                        if (!isExpanded) {
                          setLoading(true);
                          try {
                            const policy = mapEntityToPolicy(e);
                            const result = await analyzeSanction(policy);

                            setAnalysisResult(result);
                          } catch (err) {
                            console.error(err);
                          }
                      
                          setLoading(false);
                          setExpandedIndex(i);
                        } else {
                          setExpandedIndex(null);
                        }
                      }}

                      className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors whitespace-nowrap"
                    >
                      {isExpanded ? "Close" : "Learn More"}
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border bg-background/50 p-5 animate-fade-in-up">
                  {/* Summary */}
                  <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <h4 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-primary" />
                      Sanction Impact Analysis — {e.name}
                      {loading && <p className="text-xs text-muted-foreground">Analyzing...</p>}

                      {analysisResult && (
                        <p className="text-sm text-primary mt-2">
                          Impact Score: {analysisResult.impact_score}
                        </p>
                      )}

                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{e.detailSummary}</p>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "GDP Growth Δ", value: `${gdpDelta > 0 ? "+" : ""}${gdpDelta.toFixed(1)}%`, negative: gdpDelta < 0 },
                      { label: "Trade Volume Δ", value: `${tradeDelta > 0 ? "+" : ""}${tradeDelta.toFixed(1)}%`, negative: tradeDelta < 0 },
                      { label: "FDI Inflow Δ", value: `${fdiDelta > 0 ? "+" : ""}${fdiDelta.toFixed(1)}%`, negative: fdiDelta < 0 },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-lg border border-border bg-card p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                        <p className={`font-display text-lg font-bold ${stat.negative ? "text-red-400" : "text-emerald-400"}`}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* GDP Line Chart */}
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h5 className="text-sm font-semibold text-foreground mb-3">GDP Growth (%) — Before vs After</h5>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,20%)" />
                          <XAxis dataKey="year" tick={{ fill: "hsl(0,0%,55%)", fontSize: 11 }} />
                          <YAxis tick={{ fill: "hsl(0,0%,55%)", fontSize: 11 }} />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,8%)", border: "1px solid hsl(0,0%,20%)", borderRadius: 8, color: "#fff" }} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Line type="monotone" dataKey="gdpBefore" name="Before Sanction" stroke={mutedGold} strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="gdpAfter" name="After Sanction" stroke={saffronColor} strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Trade Bar Chart */}
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h5 className="text-sm font-semibold text-foreground mb-3">Trade Volume ($B) — Before vs After</h5>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,20%)" />
                          <XAxis dataKey="year" tick={{ fill: "hsl(0,0%,55%)", fontSize: 11 }} />
                          <YAxis tick={{ fill: "hsl(0,0%,55%)", fontSize: 11 }} />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,8%)", border: "1px solid hsl(0,0%,20%)", borderRadius: 8, color: "#fff" }} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Bar dataKey="tradeBefore" name="Before" fill={mutedGold} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="tradeAfter" name="After" fill={saffronColor} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* FDI Area Chart */}
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h5 className="text-sm font-semibold text-foreground mb-3">FDI Inflow ($B) — Before vs After</h5>
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,20%)" />
                          <XAxis dataKey="year" tick={{ fill: "hsl(0,0%,55%)", fontSize: 11 }} />
                          <YAxis tick={{ fill: "hsl(0,0%,55%)", fontSize: 11 }} />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,8%)", border: "1px solid hsl(0,0%,20%)", borderRadius: 8, color: "#fff" }} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Area type="monotone" dataKey="fdiBefore" name="Before" stroke={mutedGold} fill={mutedGold} fillOpacity={0.2} strokeWidth={2} />
                          <Area type="monotone" dataKey="fdiAfter" name="After" stroke={saffronColor} fill={saffronColor} fillOpacity={0.3} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No entities found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SanctionSearch;
