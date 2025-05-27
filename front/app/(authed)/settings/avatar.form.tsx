'use client';

import React, { useReducer, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/authContext';
import { z } from 'zod';
import { FormErrorMessage } from '@/components/ui/form/FormErrorMessage';

// Zod schema for color validation
const ColorSchema = z.object({
  profileColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, { message: 'Hex color invalide' }),
});

type ColorData = z.infer<typeof ColorSchema>;
type ColorErrors = Partial<Record<keyof ColorData, string[]>>;

interface State {
  saving: boolean;
  success: boolean;
  data: ColorData;
  errors: ColorErrors;
  message?: string;
}

type Action =
  | { type: 'SET_FIELD'; value: string }
  | { type: 'SET_ERRORS'; errors: ColorErrors }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'SAVE_ERROR'; message: string };

const initialState: State = {
  saving: false,
  success: false,
  data: { profileColor: '#cccccc' },
  errors: {},
  message: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, data: { profileColor: action.value }, errors: {}, message: undefined, success: false };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors, saving: false };
    case 'SAVE_START':
      return { ...state, saving: true, message: undefined, success: false };
    case 'SAVE_SUCCESS':
      return { ...state, saving: false, message: 'Couleur mise à jour !', success: true };
    case 'SAVE_ERROR':
      return { ...state, saving: false, message: action.message, success: false };
    default:
      return state;
  }
}

export default function AvatarForm() {
  const {
    state: { currentUser },
    updateUser,
  } = useAuth();
  const userId = currentUser?.id;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (currentUser) {
      dispatch({ type: 'SET_FIELD', value: currentUser.profileColor || '#cccccc' });
    }
  }, [currentUser]);

  const handleSave = async () => {
    const result = ColorSchema.safeParse({ profileColor: state.data.profileColor });
    if (!result.success) {
      dispatch({ type: 'SET_ERRORS', errors: result.error.flatten().fieldErrors });
      return;
    }
    if (!userId) return;
    dispatch({ type: 'SAVE_START' });
    try {
      await api.patch('/users/me/color', { profileColor: result.data.profileColor });
      dispatch({ type: 'SAVE_SUCCESS' });
      if (currentUser) {
        updateUser({ ...currentUser, profileColor: result.data.profileColor });
      }
    } catch (err: any) {
      dispatch({ type: 'SAVE_ERROR', message: err?.response?.data?.message || 'Échec couleur' });
    }
  };

  return (
    <div className="card w-full">
      <div className="card-body">
    <div className="form-control flex flex-col items-center space-y-2">
      {state.message && (
        <div className={`alert alert-soft ${state.success ? 'alert-success' : 'alert-error'}`}>{state.message}</div>
      )}
      <label className="relative cursor-pointer">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white border-2"
          style={{ backgroundColor: state.data.profileColor }}
        >
          {currentUser && `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()}
        </div>
        <input
          type="color"
          value={state.data.profileColor}
          disabled={state.saving}
          onChange={e => dispatch({ type: 'SET_FIELD', value: e.target.value })}
          className="absolute inset-0 w-full h-full opacity-0"
        />
      </label>
      {state.errors.profileColor && (
        <FormErrorMessage>{state.errors.profileColor.join(', ')}</FormErrorMessage>
      )}
      <button
        onClick={handleSave}
        disabled={state.saving}
        className={`btn btn-sm btn-soft w-full ${state.saving ? 'loading' : ''}`}
      >
        {state.saving ? 'Enregistrement...' : 'Enregistrer couleur'}
      </button>
    </div>
      </div>
    </div>
  );
}
