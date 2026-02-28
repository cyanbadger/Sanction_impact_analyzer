import { useState } from "react";
import { sanctionEntities, type SanctionEntity } from "@/lib/sanctionData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Building2,
  User,
  Ship,
  Landmark,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { analyzeSanction, explainMetric } from "../api";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

const typeIcons: Record<SanctionEntity["type"], typeof Building2> = {
  Organisation: Building2,
  Individual: User,
  Vessel: Ship,
  Bank: Landmark,
};

export default function SanctionSearch() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(false);
  const [dipExplanation, setDipExplanation] = useState<string>("");
  const [dipLoading, setDipLoading] = useState(false);
  const [customSanctions, setCustomSanctions] = useState<any[]>([]);
  const [newSanction, setNewSanction] = useState({
      name: "",
      severity: 0.5,
      financial: 0,
      trade: 0,
      technology: 0,
      energy: 0,
      issuer_strength: 0.7,
      binding: 1,
    });
    useEffect(() => {
      fetchCustomSanctions();
    }, []);
    
    const fetchCustomSanctions = async () => {
      const { data, error } = await supabase
        .from("sanction_policies")
        .select("*")
        .order("created_at", { ascending: false });
    
      if (!error && data) {
        const formatted = data.map((s: any) => ({
          name: s.name,
          country: "Custom",
          type: "Organisation",
          status: "Active",
          reason: "User created sanction",
          severity: s.severity,
          financial: s.financial,
          trade: s.trade,
          technology: s.technology,
          energy: s.energy,
          issuer_strength: s.issuer_strength,
          binding: s.binding,
        }));
    
        setCustomSanctions(formatted);
      }
    };
  function mapEntityToPolicy(entity: any) {
    return {
      severity:
        entity.severity ??
        (entity.status === "Active" ? 0.9 : 0.3),
      financial:
        entity.financial ??
        (entity.type === "Bank" ? 1 : 0),
      trade:
        entity.trade ??
        (entity.type === "Organisation" ? 1 : 0),
      technology:
        entity.technology ??
        (entity.reason?.toLowerCase().includes("technology") ? 1 : 0),
      energy:
        entity.energy ??
        (entity.reason?.toLowerCase().includes("oil") ? 1 : 0),
      issuer_strength: entity.issuer_strength ?? 0.7,
      binding: entity.binding ?? 1,
    };
  }
    const handleAddSanction = async () => {
      if (!newSanction.name.trim()) return;
    
      const { error } = await supabase
        .from("sanction_policies")
        .insert([newSanction]);
    
      if (error) {
        console.error(error);
        return;
      }
    
      setNewSanction({
        name: "",
        severity: 0.5,
        financial: 0,
        trade: 0,
        technology: 0,
        energy: 0,
        issuer_strength: 0.7,
        binding: 1,
      });
    
      fetchCustomSanctions();
    };

    const allSanctions = [...customSanctions, ...sanctionEntities];

  const filtered = allSanctions.filter((e) => {
    const matchesQuery =
      !query ||
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.country.toLowerCase().includes(query.toLowerCase());
    
    const matchesType = typeFilter === "All" || e.type === typeFilter;
    
    return matchesQuery && matchesType;
  });

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-semibold mb-2">
        Sanction Search
      </h2>
        <div className="border p-4 rounded mb-6 bg-card space-y-4">
          <h3 className="font-semibold">Create Custom Sanction</h3>
        
          <Input
            placeholder="Sanction Name"
            value={newSanction.name}
            onChange={(e) =>
              setNewSanction({ ...newSanction, name: e.target.value })
            }
          />
        
          {/* Severity */}
          <div>
            <label className="text-sm">
              Severity: {newSanction.severity}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={newSanction.severity}
              onChange={(e) =>
                setNewSanction({
                  ...newSanction,
                  severity: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
        
          {/* Toggles */}
          <div className="flex gap-4">
            {["financial", "trade", "technology", "energy"].map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newSanction[key as keyof typeof newSanction] === 1}
                  onChange={(e) =>
                    setNewSanction({
                      ...newSanction,
                      [key]: e.target.checked ? 1 : 0,
                    })
                  }
                />
                {key}
              </label>
            ))}
          </div>
        
          <button
            onClick={handleAddSanction}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Add Sanction
          </button>
        </div>

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Search entity..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Filter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Organisation">Organisation</SelectItem>
            <SelectItem value="Bank">Bank</SelectItem>
            <SelectItem value="Individual">Individual</SelectItem>
            <SelectItem value="Vessel">Vessel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((e, i) => {
          const TypeIcon = typeIcons[e.type];
          const isExpanded = expandedIndex === i;
          const chartData = analysisResults[i]
            ? [
                {
                  year: "Now",
                  gdp: analysisResults[i].gdp,
                  trade: analysisResults[i].trade,
                  fdi: analysisResults[i].fdi,
                },
              ]
            : [];
          return (
            <div key={i} className="border rounded p-4">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <TypeIcon className="w-4 h-4" />
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-xs text-gray-500">
                      {e.country} • {e.type}
                    </div>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (!isExpanded) {
                      setLoading(true);
                      try {
                        const policy = mapEntityToPolicy(e);
                        const result = await analyzeSanction(policy);

                        setAnalysisResults(prev => ({
                          ...prev,
                          [i]: result
                        }));

                        setExpandedIndex(i);
                      } catch (err) {
                        console.error(err);
                      }
                      setLoading(false);
                    } else {
                      setExpandedIndex(null);
                    }
                  }}
                  className="flex items-center gap-1 text-sm"
                >
                  {isExpanded ? "Close" : "Learn More"}
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4">
                  {loading && <p>Running model…</p>}

                  {analysisResults[i] && (
                    <>
                      <div className="text-lg font-semibold">
                        Impact Score: {analysisResults[i].score?.toFixed(2)}
                      </div>

                      {/* Impact Gauge Card */}
                        <div className="flex flex-col items-center justify-center py-6">
                        
                          {analysisResults[i] && (
                            <>
                              {(() => {
                                const score = analysisResults[i].score ?? analysisResults[i].gdp ?? 0.4;
                        
                                const percentage = Math.min(Math.max(score * 100, 0), 100);
                        
                                const getLevel = () => {
                                  if (percentage > 75) return "Severe Impact";
                                  if (percentage > 55) return "High Impact";
                                  if (percentage > 35) return "Moderate Impact";
                                  return "Low Impact";
                                };
                        
                                const getColor = () => {
                                  if (percentage > 75) return "#ef4444";
                                  if (percentage > 55) return "#f97316";
                                  if (percentage > 35) return "#eab308";
                                  return "#22c55e";
                                };
                        
                                const radius = 70;
                                const circumference = 2 * Math.PI * radius;
                                const offset = circumference - (percentage / 100) * circumference;
                        
                                return (
                                  <div className="flex flex-col items-center transition-all duration-500"
                                      style={{
                                      boxShadow: `0 0 25px ${getColor()}55`,
                                      borderRadius: "9999px",
                                  }}
                                >
                                    <svg width="180" height="180" className="mb-4">
                                      <circle
                                        cx="90"
                                        cy="90"
                                        r={radius}
                                        stroke="#1f2937"
                                        strokeWidth="12"
                                        fill="transparent"
                                      />
                                      <circle
                                        cx="90"
                                        cy="90"
                                        r={radius}
                                        stroke={getColor()}
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        style={{ transition: "stroke-dashoffset 0.8s ease" }}
                                      />
                                    </svg>
                        
                                    <div className="text-3xl font-bold">
                                      {percentage.toFixed(1)}%
                                    </div>
                        
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {getLevel()}
                                    </div>
                                  </div>
                                );
                              })()}
                            </>
                          )}
                        
                        </div>
                      {/* ✅ STEP 5 — SHOW NLP BELOW GRAPH */}
                      {dipLoading && (
                        <p className="text-sm text-gray-500">
                          Generating AI explanation...
                        </p>
                      )}

                      {dipExplanation && (
                        <div className="bg-gray-50 border rounded-lg p-4 mt-4">
                          <h4 className="font-semibold mb-2">
                            AI Explanation for Selected Dip
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {dipExplanation}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
