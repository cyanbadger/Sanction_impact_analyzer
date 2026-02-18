import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onViewDetails?: () => void;
}

const FeatureCard = ({ icon: Icon, title, description, onViewDetails }: FeatureCardProps) => (
  <div className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:glow-gold">
    <Icon className="mb-4 h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
    <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    {onViewDetails && (
      <button
        onClick={onViewDetails}
        className="mt-4 text-sm font-medium text-primary hover:underline"
      >
        View Details →
      </button>
    )}
  </div>
);

export default FeatureCard;
