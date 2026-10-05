'use client';

import {HeroUIProvider} from '@heroui/system';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  );
}