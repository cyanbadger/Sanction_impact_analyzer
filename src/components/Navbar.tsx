import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Moon, Sun, ArrowLeft } from "lucide-react";
import { useTheme } from "@/lib/theme";

const Navbar = () => {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="mr-1 flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Sanction Impact <span className="text-gradient-gold">Analyser</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:text-primary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-saffron">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
