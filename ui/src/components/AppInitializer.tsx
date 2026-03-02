"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { OnboardingWizard } from './onboarding/OnboardingWizard';

const LOCAL_STORAGE_KEY = 'kagent-onboarding';

// Helper to safely read localStorage (returns null during SSR)
const getInitialOnboardingState = (): boolean | null => {
  if (typeof window === 'undefined') return null;
  const hasOnboarded = localStorage.getItem(LOCAL_STORAGE_KEY);
  return hasOnboarded !== 'true';
};

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [isOnboarding, setIsOnboarding] = useState<boolean | null>(getInitialOnboardingState);
  const pathname = usePathname();

  useEffect(() => {
    setIsOnboarding(getInitialOnboardingState());
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setIsOnboarding(false);
  };

  const handleSkipWizard = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setIsOnboarding(false);
  };

  if (isOnboarding === null) {
    return null;
  }

  // Don't show the wizard on the login page
  if (isOnboarding && pathname !== '/login') {
    return <OnboardingWizard onOnboardingComplete={handleOnboardingComplete} onSkip={handleSkipWizard} />;
  }

  return <>{children}</>;
}
