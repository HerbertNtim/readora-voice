'use client';

import { PLAN_LIMITS, PLANS, PlanType } from '@/lib/subscription-constants';
import { useAuth, useUser } from '@clerk/nextjs';

export const useSubscription = () => {
  const { has, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const isLoaded = isAuthLoaded && isUserLoaded;

  if (!isLoaded) {
    return {
      plan: PLANS.FREE,
      limits: PLAN_LIMITS[PLANS.FREE],
      isLoaded: false,
    };
  }

  let plan: PlanType = PLANS.FREE;

  if (has?.({ product: 'pro' })) {
    plan = PLANS.PRO;
  } else if (has?.({ product: 'standard' })) {
    plan = PLANS.STANDARD;
  }

  return {
    plan,
    limits: PLAN_LIMITS[plan],
    isLoaded: true,
  };
};
