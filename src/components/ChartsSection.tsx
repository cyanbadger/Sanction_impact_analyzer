import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { getGdpData, getTradeData, getFdiData, type SanctionType } from "@/lib/sanctionData";
import { useState } from "react";
import { explainMetric } from "../api";
const chartColors = {
  gold: "hsl(43, 96%, 56%)",
  saffron: "hsl(33, 100%, 50%)",
  dim: "hsl(33, 60%, 30%)",
  teal: "hsl(170, 60%, 50%)",
};

const tooltipStyle = {
  backgroundColor: "hsl(0, 0%, 8%)",
  border: "1px solid hsl(33, 30%, 16%)",
  borderRadius: 8,
  color: "#fff",
};

const gridStroke = "hsl(33, 10%, 15%)";
const axisStroke = "hsl(0, 0%, 40%)";

const ChartsSection = ({ sanctionType }: { sanctionType: SanctionType }) => {
  const [explanation, setExplanation] = useState("");
  const [explainLoading, setExplainLoading] = useState(false);
  const gdp = getGdpData(sanctionType);
  const trade = getTradeData(sanctionType);
  const fdi = getFdiData(sanctionType);
  const loadingMessages = [
  "Running analysis… that’s what she said.",
  "Crunching numbers… we’ll be back.",
  "Analyzing data… may the graphs be with you.",
  "Processing request… one does not simply ignore sanctions.",
  "Optimizing insights… it’s not a bug, it’s a feature.",
  "Running simulation… let’s circle back shortly.",
  "Consulting models… trust the process.",
  "Checking assumptions… because spreadsheets never lie."
  ];
  const [loadingText] = useState(
  loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* GDP Line Chart */}
      <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          GDP Growth (%) — {sanctionType}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={gdp}
            onClick={async (state: any) => {
              if (!state?.activePayload) return;
          
              const value = state.activePayload[0].value;
          
              setExplainLoading(true);
          
              try {
                const res = await explainMetric({
                  metric: "gdp",
                  value,
                  context: {
                    severity: 0.9,
                    financial: 1,
                    trade: 1,
                    technology: 0,
                    energy: 1,
                  },
                });
          
                setExplanation(res.explanation);
              } catch (err) {
                console.error(err);
              }
          
              setExplainLoading(false);
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="year" stroke={axisStroke} fontSize={12} />
            <YAxis stroke={axisStroke} fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="value" stroke={chartColors.gold} strokeWidth={3} dot={{ r: 4, fill: chartColors.gold }} name="GDP %" />
          </LineChart>
        </ResponsiveContainer>
          {explainLoading && (
            <p className="text-sm text-muted-foreground mt-4">
              <div className="animate-pulse text-sm text-muted-foreground mt-4">
                {loadingText}
              </div>            </p>
          )}
          
          {explanation && (
            <div className="mt-4 rounded-lg border border-border bg-card p-4">
              <h4 className="font-semibold mb-2">AI Economic Interpretation</h4>
              <p className="text-sm leading-relaxed">{explanation}</p>
            </div>
          )}
      </div>

      {/* Trade Bar Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Trade Volume (B USD) — Before vs After
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trade}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="year" stroke={axisStroke} fontSize={12} />
            <YAxis stroke={axisStroke} fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="before" fill={chartColors.dim} name="Before Sanctions" radius={[4, 4, 0, 0]} />
            <Bar dataKey="after" fill={chartColors.saffron} name="After Sanctions" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FDI Area Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          FDI Inflow Trend (B USD)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={fdi}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="year" stroke={axisStroke} fontSize={12} />
            <YAxis stroke={axisStroke} fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="value" stroke={chartColors.gold} fill={chartColors.gold} fillOpacity={0.15} strokeWidth={2} name="FDI (B USD)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;
