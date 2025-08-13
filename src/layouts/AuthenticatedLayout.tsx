import { Outlet } from "react-router-dom";
import { AppNavbar } from "../components/AppNavbar";

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}