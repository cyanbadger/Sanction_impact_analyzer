import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-12">
    <div className="container mx-auto grid gap-8 px-6 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-foreground">Sanction Impact Analyser</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tracking and analysing the economic impact of international sanctions on India.
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold text-foreground mb-3">About</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This platform provides data-driven insights into how sanctions affect India's GDP, trade, defence procurement, and foreign investment flows.
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold text-foreground mb-3">Contact</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Email: info@sanctionanalyser.in<br />
          Phone: +91 11 2345 6789
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold text-foreground mb-3">Data Sources</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          World Bank, IMF, RBI, OFAC, Ministry of Commerce & Industry, UNCTAD, SIPRI, and other publicly available datasets.
        </p>
      </div>
    </div>
    <div className="container mx-auto px-6 mt-8 pt-6 border-t border-border">
      <p className="text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Global Sanction Impact Analyser – India. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
