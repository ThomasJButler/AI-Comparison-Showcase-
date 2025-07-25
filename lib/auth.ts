// Simple demo auth utilities
export function getCurrentUser() {
  return {
    id: "demo",
    name: "Demo User",
    email: "demo@AiTomatic.com",
    role: "user"
  };
}

export function requireAuth() {
  return getCurrentUser();
}

export function isAdmin(user: any) {
  return user?.role === 'admin';
}