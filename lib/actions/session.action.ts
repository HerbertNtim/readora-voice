'use server';

import VoiceSession from '@/database/models/voice-session.model';
import { connectToDatabase } from '@/database/mongoose';
import { StartSessionResult } from '@/types';

export const startVoiceSession = async (
  clerkId,
  bookId,
): Promise<StartSessionResult> => {
  try {
    await connectToDatabase();

    const session = await VoiceSession.create({
      clerkId,
      bookId,
      startedAt: new Date(),
      billingPeriodStart: getCurrentBillingPeriodStart(),
    });
  } catch (error) {
    console.error('Error starting voice session', error);
    return {
      success: false,
      error: 'Failed to start voice session. Please try again later.',
    };
  }
};
