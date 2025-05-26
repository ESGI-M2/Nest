'use client';

import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
  ReactElement,
} from 'react';
import api from '@/lib/api';

export type Conversation = {
  id: string;
  name: string;
  createdAt: string;
};

type State = {
  conversations: Conversation[];
  loading: boolean;
  error?: string;
};

type Action =
  | { type: 'SET'; conversations: Conversation[] }
  | { type: 'ADD'; conversation: Conversation }
  | { type: 'ERROR'; message: string }
  | { type: 'LOADING'; loading: boolean };

const initialState: State = { conversations: [], loading: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET':
      return { ...state, conversations: action.conversations, loading: false, error: undefined };
    case 'ADD':
      return { ...state, conversations: [action.conversation, ...state.conversations] };
    case 'ERROR':
      return { ...state, error: action.message, loading: false };
    case 'LOADING':
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

interface ContextValue {
  state: State;
  addConversation: (c: Conversation) => void;
}

const ConversationContext = createContext<ContextValue | undefined>(undefined);

export function ConversationsProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOADING', loading: true });
    api
      .get<Conversation[]>('/conversations')
      .then((res) => dispatch({ type: 'SET', conversations: res.data }))
      .catch((err) =>
        dispatch({
          type: 'ERROR',
          message: err?.response?.data?.message || 'Failed to load conversations',
        })
      );
  }, []);

  const addConversation = (conv: Conversation) => {
    dispatch({ type: 'ADD', conversation: conv });
  };

  return (
    <ConversationContext.Provider value={{ state, addConversation }}>
      {children}
    </ConversationContext.Provider>
  );
}

function useConversationContext() {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error('useConversationContext must be used inside ConversationsProvider');
  return ctx;
}

export function useConversations() {
  return useConversationContext().state.conversations;
}

export function useConversationsLoading() {
  return useConversationContext().state.loading;
}

export function useConversationError() {
  return useConversationContext().state.error;
}

export function useAddConversation() {
  return useConversationContext().addConversation;
}
