'use server';

import VoiceSession from '@/database/models/voice-session.model';
import { connectToDatabase } from '@/database/mongoose';
import { EndSessionResult, StartSessionResult } from '@/types';

export const startVoiceSession = async (
  clerkId: string,
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    await connectToDatabase();

    // Limits/Plan to see whether a session is allowed.
    const { getUserPlan } = await import('@/lib/subscription.server');
    const { PLAN_LIMITS, getCurrentBillingPeriodStart } =
      await import('@/lib/subscription-constants');

    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];
    const billingPeriodStart = getCurrentBillingPeriodStart();

    // 1. Check for existing ACTIVE session
    const existingSession = await VoiceSession.findOne({
      clerkId,
      bookId,
      endedAt: { $exists: false }, // or status: "active"
    });

    if (existingSession) {
      return {
        success: true,
        sessionId: existingSession._id.toString(),
      };
    }

    const sessionCount = await VoiceSession.countDocuments({
      clerkId,
      billingPeriodStart,
    });

    if (sessionCount >= limits.maxSessionsPerMonth) {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/');

      return {
        success: false,
        error: `You have reached the monthly session limit for your ${plan} plan (${limits.maxSessionsPerMonth}). Please Upgrade for more sessions.`,
        isBillingError: true,
      };
    }

    // 2. Create new session only if none exists
    const session = await VoiceSession.create({
      clerkId,
      bookId,
      startedAt: new Date(),
      billingPeriodStart,
      durationSeconds: 0,
    });

    return {
      success: true,
      sessionId: session._id.toString(),
      maxDurationMinutes: limits.maxDurationPerSession,
    };
  } catch (error) {
    console.error('Error starting voice session', error);

    return {
      success: false,
      error: 'Failed to start voice session. Please try again later.',
    };
  }
};

export const endVoiceSession = async (
  sessionId: string,
  durationSeconds: number,
): Promise<EndSessionResult> => {
  try {
    await connectToDatabase();

    const result = await VoiceSession.findByIdAndUpdate(sessionId, {
      endedAt: new Date(),
      durationSeconds,
    });

    if (!result) {
      return {
        success: false,
        error: 'Voice session not found.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error ending voice session', error);
    return {
      success: false,
      error: 'Failed to end voice session, Please try again later.',
    };
  }
};
