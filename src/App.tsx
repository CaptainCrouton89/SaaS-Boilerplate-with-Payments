import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";

// Layouts
import { MarketingLayout } from "./layouts/MarketingLayout";
import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout";

// Marketing Pages
import { LandingPage } from "./pages/LandingPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PricingPage } from "./pages/PricingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";

// Authenticated Pages
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";

// Components
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  const user = useQuery(api.auth.loggedInUser);

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          {/* Marketing Routes (Unauthenticated) */}
          <Route path="/" element={<MarketingLayout />}>
            <Route 
              index 
              element={
                user === null ? <LandingPage /> : <Navigate to="/dashboard" replace />
              } 
            />
            <Route 
              path="about" 
              element={
                user === null ? <AboutPage /> : <Navigate to="/dashboard" replace />
              } 
            />
            <Route 
              path="contact" 
              element={
                user === null ? <ContactPage /> : <Navigate to="/dashboard" replace />
              } 
            />
            <Route 
              path="pricing" 
              element={
                user === null ? <PricingPage /> : <Navigate to="/dashboard" replace />
              } 
            />
            <Route 
              path="login" 
              element={
                user === null ? <LoginPage /> : <Navigate to="/dashboard" replace />
              } 
            />
            <Route 
              path="signup" 
              element={
                user === null ? <SignupPage /> : <Navigate to="/dashboard" replace />
              } 
            />
          </Route>

          {/* Authenticated Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AuthenticatedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback Route */}
          <Route 
            path="*" 
            element={
              user === null ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
        </Routes>
        
        <Toaster />
      </div>
    </BrowserRouter>
  );
}
