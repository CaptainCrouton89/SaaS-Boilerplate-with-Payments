import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { PricingSection } from "./components/PricingSection";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">SaaS Boilerplate</h2>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Authenticated>
        <Dashboard />
      </Authenticated>
      
      <Unauthenticated>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Build Your SaaS
          </h1>
          <p className="text-xl text-secondary mb-8">
            Complete boilerplate with subscriptions and payments
          </p>
          <div className="max-w-md mx-auto">
            <SignInForm />
          </div>
        </div>
        <PricingSection />
      </Unauthenticated>
    </div>
  );
}
