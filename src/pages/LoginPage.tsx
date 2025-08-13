import { SignInForm } from "../SignInForm";

export function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md mx-auto">
        <SignInForm defaultFlow="signIn" />
      </div>
    </div>
  );
}