export class AuthenticationError extends Error {
  constructor(message = "User not authenticated") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof Error && error.name === "AuthenticationError";
}