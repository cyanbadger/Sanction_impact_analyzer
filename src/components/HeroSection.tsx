import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown, Globe, BarChart3, ShieldAlert, Search, Activity } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(33_100%_50%_/_0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(33_100%_50%_/_0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(33_100%_50%_/_0.08),transparent_70%)]" />
      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[radial-gradient(circle,hsl(43_96%_56%_/_0.06),transparent_70%)]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle,hsl(33_100%_50%_/_0.05),transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary animate-fade-in-up">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          Real-time Sanction Intelligence for India
        </div>

        <h1
          className="mx-auto max-w-5xl font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          WELCOME to{" "}
          <span className="text-gradient-gold">SANCTION IMPACT ANALYSER</span>{" "}
          for <span className="text-primary">INDIA</span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          Learn how the sanctions are affecting our country and learn about our
          country's growth in economy. Track risks, screen entities, and analyse economic trends.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-saffron gap-2 px-8 text-base font-semibold"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Feature highlights */}
        <div
          className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3 animate-fade-in-up"
          style={{ animationDelay: "0.55s" }}
        >
          {[
            { icon: ShieldAlert, label: "Risk Assessment", value: "Real-time", desc: "Country risk scoring" },
            { icon: Search, label: "Sanction Search", value: "Instant", desc: "Screen entities globally" },
            { icon: Activity, label: "GDP & FDI Analysis", value: "2015–2025", desc: "Track economic trends" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:glow-gold group"
            >
              <stat.icon className="mx-auto mb-3 h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-primary/80">{stat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          {[
            { icon: TrendingDown, label: "Sanctions Tracked", value: "1,200+" },
            { icon: Globe, label: "Countries Monitored", value: "45+" },
            { icon: BarChart3, label: "Economic Indicators", value: "300+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
              <p className="font-display text-2xl font-bold text-gradient-gold">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
