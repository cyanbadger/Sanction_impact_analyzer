import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
  impactCountries,
  type ImpactCountry,
  getCountryGdpComparison,
  getCountryTradeComparison,
  getCountryFdiComparison,
  getCountryDescription,
  getCountryStats,
} from "@/lib/countryImpactData";
import { ArrowLeft } from "lucide-react";

const chartColors = {
  before: "hsl(43, 96%, 56%)",
  after: "hsl(0, 72%, 51%)",
  beforeFill: "hsl(43, 96%, 56%)",
  afterFill: "hsl(0, 72%, 51%)",
};

const tooltipStyle = {
  backgroundColor: "hsl(0, 0%, 8%)",
  border: "1px solid hsl(33, 30%, 16%)",
  borderRadius: 8,
  color: "#fff",
};

const gridStroke = "hsl(33, 10%, 15%)";
const axisStroke = "hsl(0, 0%, 40%)";

const AnalyzeImpact = () => {
  const [country, setCountry] = useState<ImpactCountry>("USA");
  const navigate = useNavigate();

  const gdpData = getCountryGdpComparison(country);
  const tradeData = getCountryTradeComparison(country);
  const fdiData = getCountryFdiComparison(country);
  const description = getCountryDescription(country);
  const stats = getCountryStats(country);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2 animate-fade-in-up">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary hover:text-primary transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl mt-6 animate-fade-in-up">
          Country-wise <span className="text-gradient-gold">Impact Analysis</span>
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Select a country to see the before &amp; after economic impact of its sanctions on India's GDP, Trade, and FDI.
        </p>

        {/* Country Selector */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <label className="font-display text-lg font-semibold text-foreground">
            Select Country:
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as ImpactCountry)}
            className="rounded-lg border border-border bg-card px-5 py-3 text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring min-w-[200px]"
          >
            {impactCountries.map((c) => (
              <option key={c} value={c} className="bg-card text-foreground">{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-display text-lg font-semibold text-gradient-gold mb-2">
            {country} — Sanction Impact on India
          </h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 rounded-xl border border-border bg-card p-8 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <AnimatedCounter target={parseFloat(stats.gdpChange)} label="GDP Change %" />
          <AnimatedCounter target={parseFloat(stats.tradeChange)} label="Trade Change %" />
          <AnimatedCounter target={parseFloat(stats.fdiChange)} label="FDI Change %" />
        </div>

        {/* Charts */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {/* GDP Before vs After */}
          <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              GDP Growth (%) — Before vs After <span className="text-gradient-gold">{country}</span> Sanctions
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={gdpData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="year" stroke={axisStroke} fontSize={12} />
                <YAxis stroke={axisStroke} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="before" stroke={chartColors.before} strokeWidth={3} dot={{ r: 4 }} name="Before Sanctions" />
                <Line type="monotone" dataKey="after" stroke={chartColors.after} strokeWidth={3} dot={{ r: 4 }} strokeDasharray="6 3" name="After Sanctions" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trade Before vs After */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Trade Volume (B USD) — Before vs After
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="year" stroke={axisStroke} fontSize={12} />
                <YAxis stroke={axisStroke} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="before" fill={chartColors.before} name="Before Sanctions" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" fill={chartColors.after} name="After Sanctions" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FDI Before vs After */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              FDI Inflow (B USD) — Before vs After
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={fdiData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="year" stroke={axisStroke} fontSize={12} />
                <YAxis stroke={axisStroke} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area type="monotone" dataKey="before" stroke={chartColors.before} fill={chartColors.before} fillOpacity={0.15} strokeWidth={2} name="Before Sanctions" />
                <Area type="monotone" dataKey="after" stroke={chartColors.after} fill={chartColors.after} fillOpacity={0.15} strokeWidth={2} name="After Sanctions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AnalyzeImpact;
