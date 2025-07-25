import { ProtectedRoute } from '@/components/protected-route';

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}