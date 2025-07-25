"use client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // In demo mode, we'll render the children directly without auth checks
  return <>{children}</>;
}