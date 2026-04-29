import { IBook, Messages } from '@/types';
import { useAuth } from '@clerk/nextjs';
import { useRef, useState } from 'react';

export type CallStatus =
  | 'idle'
  | 'connecting'
  | 'starting'
  | 'messages'
  | 'listening'
  | 'thinking'
  | 'speaking';

export const useVapi = (book: IBook) => {
  const { userId } = useAuth();

  const [status, setStatus] = useState<CallStatus>('idle');
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentUserMessage, setCurrentUserMessage] = useState('');
  const [duration, setDuration] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isStoppingRef = useRef<boolean>(false);
};
