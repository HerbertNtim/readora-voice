import { DEFAULT_VOICE } from '@/lib/constants';
import { IBook, Messages } from '@/types';
import { useAuth } from '@clerk/nextjs';
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
