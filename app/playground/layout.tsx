import { ProtectedRoute } from '@/components/protected-route';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}