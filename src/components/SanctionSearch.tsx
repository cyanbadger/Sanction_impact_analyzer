import { useState } from "react";
import { sanctionEntities, type SanctionEntity } from "@/lib/sanctionData";
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

  const filtered = sanctionEntities.filter((e) => {
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

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Search entity..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded px-3"
        >
          <option value="All">All</option>
          <option value="Organisation">Organisation</option>
          <option value="Bank">Bank</option>
          <option value="Individual">Individual</option>
          <option value="Vessel">Vessel</option>
        </select>
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

                      {/* ✅ GRAPH WITH CLICK HANDLER */}
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart
                          data={chartData}
                          onClick={async (data: any) => {
                            if (!data?.activePayload || !analysisResults[i]) return;

                            const clickedValue = data.activePayload[0].value;

                            setDipLoading(true);

                            try {
                              const explanation = await explainMetric({
                                metric: "gdp",
                                value: clickedValue,
                                context: mapEntityToPolicy(e),
                              });

                              setDipExplanation(explanation.explanation);
                            } catch (err) {
                              console.error(err);
                            }

                            setDipLoading(false);
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line dataKey="gdp" />
                        </LineChart>
                      </ResponsiveContainer>

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
