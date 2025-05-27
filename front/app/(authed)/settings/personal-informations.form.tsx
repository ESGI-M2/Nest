'use client';

import React, { useEffect, useReducer } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/authContext';
import { z } from 'zod';
import { FormErrorMessage } from '@/components/ui/form/FormErrorMessage';

// Zod schema for personal info validation
const PersonalInfoSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' }).trim(),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }).trim(),
});

type PersonalInfoData = z.infer<typeof PersonalInfoSchema>;
type PersonalInfoErrors = Partial<Record<keyof PersonalInfoData, string[]>>;

interface State {
  loading: boolean;
  saving: boolean;
  success: boolean;
  data: PersonalInfoData;
  errors: PersonalInfoErrors;
  message?: string;
}

type Action =
  | { type: 'INIT_START' }
  | { type: 'INIT_SUCCESS'; payload: PersonalInfoData }
  | { type: 'INIT_ERROR'; message: string }
  | { type: 'SET_FIELD'; field: keyof PersonalInfoData; value: string }
  | { type: 'SET_ERRORS'; errors: PersonalInfoErrors }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'SAVE_ERROR'; message: string };

const initialState: State = {
  loading: true,
  saving: false,
  success: false,
  data: { firstName: '', lastName: '' },
  errors: {},
  message: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, loading: true, errors: {}, message: undefined, success: false };
    case 'INIT_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'INIT_ERROR':
      return { ...state, loading: false, message: action.message };
    case 'SET_FIELD':
      return { ...state, data: { ...state.data, [action.field]: action.value }, errors: {}, message: undefined, success: false };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors, saving: false };
    case 'SAVE_START':
      return { ...state, saving: true, message: undefined, success: false };
    case 'SAVE_SUCCESS':
      return { ...state, saving: false, message: 'Informations mises à jour !', success: true };
    case 'SAVE_ERROR':
      return { ...state, saving: false, message: action.message, success: false };
    default:
      return state;
  }
}

export default function PersonalInformationsForm() {
  const {
    state: { currentUser },
    updateUser,
  } = useAuth();
  const userId = currentUser?.id;
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize form fields from context
  useEffect(() => {
    if (currentUser) {
      dispatch({ type: 'INIT_SUCCESS', payload: { firstName: currentUser.firstName, lastName: currentUser.lastName } });
    }
  }, [currentUser]);

  const handleSave = async () => {
    const result = PersonalInfoSchema.safeParse(state.data);
    if (!result.success) {
      dispatch({ type: 'SET_ERRORS', errors: result.error.flatten().fieldErrors });
      return;
    }
    if (!userId) return;
    dispatch({ type: 'SAVE_START' });
    try {
      await api.patch(`/users/me/personal-info`, result.data);
      dispatch({ type: 'SAVE_SUCCESS' });
      // sync to auth context
      if (currentUser) {
        updateUser({ ...currentUser, ...result.data });
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
            <label className="label"><span className="label-text">Prénom</span></label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={state.data.firstName}
              disabled={state.saving}
              onChange={e => dispatch({ type: 'SET_FIELD', field: 'firstName', value: e.target.value })}
            />
            {state.errors.firstName && <FormErrorMessage>{state.errors.firstName.join(', ')}</FormErrorMessage>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Nom</span></label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={state.data.lastName}
              disabled={state.saving}
              onChange={e => dispatch({ type: 'SET_FIELD', field: 'lastName', value: e.target.value })}
            />
            {state.errors.lastName && <FormErrorMessage>{state.errors.lastName.join(', ')}</FormErrorMessage>}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={state.saving}
            className={`btn btn-sm btn-soft w-full ${state.saving ? 'loading' : ''}`}>
            {state.saving ? 'Enregistrement...' : 'Sauvegarder'}
          </button>
        </form>
      </div>
    </div>
  );
}
