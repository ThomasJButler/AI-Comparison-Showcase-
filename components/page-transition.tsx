"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingAnimation } from './loading-animation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsLoading(true);
      // Shorter timeout for faster transitions
      setTimeout(() => {
        setCurrentPath(pathname);
        setIsLoading(false);
      }, 1500);
    }
  }, [pathname, currentPath]);

  return (
    <>
      <LoadingAnimation 
        isLoading={isLoading}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {children}
    </>
  );
}