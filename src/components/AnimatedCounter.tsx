import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

const AnimatedCounter = ({ target, suffix = "%", prefix = "", label, duration = 1500 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if ((target >= 0 && start >= target) || (target < 0 && start <= target)) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(parseFloat(start.toFixed(1)));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  const isPositive = count >= 0;

  return (
    <div className="text-center">
      <p className={`font-display text-3xl font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
        {prefix}{count > 0 ? "+" : ""}{count}{suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export default AnimatedCounter;
