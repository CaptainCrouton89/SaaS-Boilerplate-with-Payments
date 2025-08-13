import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-primary mb-6">
          Build Your SaaS
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Complete boilerplate with subscriptions and payments
        </p>
        
        <div className="flex justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}