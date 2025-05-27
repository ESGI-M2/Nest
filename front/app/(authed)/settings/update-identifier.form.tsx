'use client';

import React, { useEffect, useReducer } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/authContext';
import { z } from 'zod';
import { FormErrorMessage } from '@/components/ui/form/FormErrorMessage';

const EmailSchema = z.object({
  email: z
    .string()
    .email({ message: 'Veuillez entrer une adresse e-mail valide.' })
    .trim(),
});

type EmailData = z.infer<typeof EmailSchema>;
type EmailErrors = Partial<Record<keyof EmailData, string[]>>;

interface State {
  loading: boolean;
  saving: boolean;
  success: boolean;
  data: EmailData;
  errors: EmailErrors;
  message?: string;
}

type Action =
  | { type: 'INIT_START' }
  | { type: 'INIT_SUCCESS'; payload: EmailData }
  | { type: 'INIT_ERROR'; message: string }
  | { type: 'SET_FIELD'; value: string }
  | { type: 'SET_ERRORS'; errors: EmailErrors }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'SAVE_ERROR'; message: string };

const initialState: State = {
  loading: true,
  saving: false,
  success: false,
  data: { email: '' },
  errors: {},
  message: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, loading: true, message: undefined, success: false, errors: {} };
    case 'INIT_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'INIT_ERROR':
      return { ...state, loading: false, message: action.message };
    case 'SET_FIELD':
      return { ...state, data: { email: action.value }, errors: {}, message: undefined, success: false };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors, saving: false };
    case 'SAVE_START':
      return { ...state, saving: true, message: undefined, success: false };
    case 'SAVE_SUCCESS':
      return { ...state, saving: false, message: 'Email mis à jour !', success: true };
    case 'SAVE_ERROR':
      return { ...state, saving: false, message: action.message, success: false };
    default:
      return state;
  }
}

export default function UpdateIdentifierForm() {
  const {
    state: { currentUser },
    updateUser,
  } = useAuth();

  useEffect(() => {
    if (currentUser) {
      dispatch({ type: 'INIT_SUCCESS', payload: { email: currentUser.email } });
    }
  }, [currentUser]);

  const userId = currentUser?.id;
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSave = async () => {
    const result = EmailSchema.safeParse({ email: state.data.email });
    if (!result.success) {
      dispatch({ type: 'SET_ERRORS', errors: result.error.flatten().fieldErrors });
      return;
    }
    if (!userId) return;
    dispatch({ type: 'SAVE_START' });
    try {
      await api.patch(`/users/me/identifier`, { email: result.data.email });
      dispatch({ type: 'SAVE_SUCCESS' });
      if (currentUser) {
        updateUser({ ...currentUser, email: result.data.email });
      }
    } catch (err: any) {
      dispatch({ type: 'SAVE_ERROR', message: err?.response?.data?.message || 'Échec de mise à jour' });
    }
  };

  return (
    <div className="card w-full">
      <div className="card-body">
        {state.message && (
          <div className={`alert alert-soft mb-4 ${state.success ? 'alert-success' : 'alert-error'}`}>
            <span>{state.message}</span>
          </div>
        )}

        <form onSubmit={e => e.preventDefault()} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Adresse e-mail</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={state.data.email}
              disabled={state.saving}
              onChange={e => dispatch({ type: 'SET_FIELD', value: e.target.value })}
            />
            {state.errors.email && (
              <FormErrorMessage>
                {state.errors.email.join(', ')}
              </FormErrorMessage>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={state.saving}
            className={`btn btn-sm btn-soft w-full ${state.saving ? 'loading' : ''}`}
          >
            {state.saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
}
