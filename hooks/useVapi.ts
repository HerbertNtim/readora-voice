import { startVoiceSession } from '@/lib/actions/session.action';
import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS } from '@/lib/constants';
import { getVoice } from '@/lib/utils';
import { IBook, Messages } from '@/types';
import { useAuth } from '@clerk/nextjs';
import Vapi from '@vapi-ai/web';
import { useEffect, useRef, useState } from 'react';

export type CallStatus =
  | 'idle'
  | 'connecting'
  | 'starting'
  | 'messages'
  | 'listening'
  | 'thinking'
  | 'speaking';

const useLatestRef = <T>(value: T) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY;

let vapi: InstanceType<typeof Vapi>;

function getVapi() {
  if (!vapi) {
    if (!VAPI_API_KEY) {
      throw new Error(
        'NEXT_PUBLIC_VAPI_API_KEY not found. Update your env file.',
      );
    }

    vapi = new Vapi(VAPI_API_KEY);
  }

  return vapi;
}

const useVapi = (book: IBook) => {
  const { userId } = useAuth();

  const [status, setStatus] = useState<CallStatus>('idle');
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentUserMessage, setCurrentUserMessage] = useState('');
  const [duration, setDuration] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isStoppingRef = useRef<boolean>(false);

  const bookRef = useLatestRef(book);
  const durationRef = useLatestRef(duration);
  const voice = book.persona || DEFAULT_VOICE;

  const isActive =
    status === 'listening' ||
    status === 'thinking' ||
    status === 'speaking' ||
    status === 'starting';

  // const maxDurationRef = useLatestRef(limits.maxSessionMinutes * 60)
  // const maxDurationSeconds
  // const remainingSeconds
  // const showTimeWarning

  const start = async () => {
    if (!userId) return setLimitError('Please login to start a conversation.');

    setLimitError(null);
    setStatus('connecting');

    try {
      const startSession = await startVoiceSession(userId, book._id);

      if (!startSession.success) {
        setLimitError(
          startSession.error || 'Session limit reached. Upgrade your plan!',
        );
        setStatus('idle');
        return;
      }

      sessionIdRef.current = startSession.sessionId || null;

      const firstMessage = `Hey, good to meet you. Before we dive in: have you read ${book.title} yet? Or are we starting fresh?`;

      await getVapi().start(ASSISTANT_ID, {
        firstMessage,
        variableValues: {
          title: book.title,
          author: book.author,
          bookId: book._id,
        },
        // voice: {
        //   provider: '11labs',
        //   voiceId: getVoice(voice).id,
        //   model: 'eleven_turbo_v2_5' as const,
        //   stability: VOICE_SETTINGS.stability,
        //   similarityBoost:  VOICE_SETTINGS.similarityBoost,
        //   style: VOICE_SETTINGS.style,
        //   useSpeakerBoost: VOICE_SETTINGS.useSpeakerBoost
        // }
      });
    } catch (error) {
      console.error('Error starting call.', error);
      setStatus('idle');
      setLimitError('An error occurred while starting the call.');
    }
  };
  const stop = async () => {};
  const clearErrors = async () => {};

  return {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    limitError,
    start,
    stop,
    clearErrors,
    // maxDurationSeconds, remainingSeconds, showTimeWarning
  };
};

export default useVapi;
