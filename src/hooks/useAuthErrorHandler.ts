import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useAuthErrorHandler() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  const handleAuthError = async (error: unknown) => {
    if (error instanceof Error && (
      error.message.includes("User not authenticated") ||
      error.message.includes("AuthenticationError") ||
      error.name === "AuthenticationError"
    )) {
      try {
        await signOut();
      } catch (signOutError) {
        console.warn("Failed to sign out after auth error:", signOutError);
      }
      
      toast.error("Please sign in to continue");
      navigate("/login");
      return true;
    }
    return false;
  };

  return { handleAuthError };
}