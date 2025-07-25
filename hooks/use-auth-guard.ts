"use client";

import { useRouter, usePathname } from 'next/navigation';

export function useAuthGuard() {
  // In demo mode, we'll consider everyone authenticated
  return {
    isAuthenticated: true,
    isLoading: false
  };
}