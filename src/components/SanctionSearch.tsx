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
  const [customSanctions, setCustomSanctions] = useState<SanctionEntity[]>([]);
  const [newName, setNewName] = useState("");

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
    const handleAddSanction = () => {
      if (!newName.trim()) return;
    
      const newSanction: SanctionEntity = {
        name: newName,
        country: "Custom",
        type: "Organisation",
        status: "Active",
        reason: "User defined sanction",
      };
    
      setCustomSanctions(prev => [newSanction, ...prev]);
      setNewName("");
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
        <div className="border p-4 rounded mb-6 bg-card">
          <h3 className="font-semibold mb-3">Add New Sanction Info</h3>
        
          <div className="flex gap-3">
            <Input
              placeholder="Enter sanction name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              onClick={handleAddSanction}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Add
            </button>
          </div>
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
                                  <div className="flex flex-col items-center transitio-all duration-500"
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
