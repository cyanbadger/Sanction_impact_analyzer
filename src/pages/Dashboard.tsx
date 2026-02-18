import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import ChartsSection from "@/components/ChartsSection";
import AnimatedCounter from "@/components/AnimatedCounter";
import RiskAssessment from "@/components/RiskAssessment";
import SanctionSearch from "@/components/SanctionSearch";
import CaseStudies from "@/components/CaseStudies";
import { sanctionTypes, getStats, type SanctionType } from "@/lib/sanctionData";
import { TrendingDown, ArrowLeftRight, Landmark } from "lucide-react";

const Dashboard = () => {
  const [sanctionType, setSanctionType] = useState<SanctionType>("All");
  const chartsRef = useRef<HTMLDivElement>(null);
  const stats = getStats(sanctionType);
  const navigate = useNavigate();

  const scrollToCharts = () => {
    chartsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-16">
        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl animate-fade-in-up">
          Economic Impact <span className="text-gradient-gold">Dashboard</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Explore real-time data on how international sanctions influence India's economy — from defence procurement to energy security.
        </p>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <FeatureCard
            icon={TrendingDown}
            title="GDP Impact"
            description="India's GDP growth dropped from 7.5% to 4.0% (2015-2019) partly due to trade restrictions and compliance costs."
            onViewDetails={scrollToCharts}
          />
          <FeatureCard
            icon={ArrowLeftRight}
            title="Trade Impact"
            description="India's trade with Iran fell from $17B to under $2B after US JCPOA withdrawal. Russia trade restructured via Rupee-Rouble."
            onViewDetails={scrollToCharts}
          />
          <FeatureCard
            icon={Landmark}
            title="FDI Impact"
            description="Chinese FDI pipeline of $26B frozen after 2020 restrictions. India pivoted to PLI schemes attracting $15B from US/EU."
            onViewDetails={scrollToCharts}
          />
        </div>

        {/* Animated Counters */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 rounded-xl border border-border bg-card p-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <AnimatedCounter target={parseFloat(stats.gdpChange)} label="GDP Change %" />
          <AnimatedCounter target={parseFloat(stats.tradeChange)} label="Trade Change %" />
          <AnimatedCounter target={parseFloat(stats.fdiChange)} label="FDI Change %" />
        </div>

        {/* Risk Assessment */}
        <RiskAssessment />

        {/* Sanction Search */}
        <SanctionSearch />

        {/* Charts Section */}
        <div ref={chartsRef} className="mt-14 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Data <span className="text-gradient-gold">Visualisation</span>
            </h2>
            <select
              value={sanctionType}
              onChange={(e) => setSanctionType(e.target.value as SanctionType)}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sanctionTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <ChartsSection sanctionType={sanctionType} />
        </div>

        {/* Analyze Impact CTA */}
        <div className="mt-14 flex justify-center animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          <button
            onClick={() => navigate("/analyze-impact")}
            className="group relative rounded-xl bg-gradient-to-r from-primary to-[hsl(33,100%,50%)] px-10 py-4 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_hsl(43,96%,56%,0.3)]"
          >
            🔍 Analyze Impact by Country
          </button>
        </div>

        {/* Real-World Case Studies */}
        <CaseStudies />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
