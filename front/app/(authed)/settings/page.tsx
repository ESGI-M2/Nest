'use client';

import React, { useEffect, useReducer } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/authContext';
import { z } from 'zod';
import { FormErrorMessage } from '@/components/ui/form/FormErrorMessage';

// Zod schema for profile validation
const ProfileSchema = z.object({
  profileColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, { message: 'Hex color invalide' }),
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Email invalide.' }),
});

type ProfileData = z.infer<typeof ProfileSchema>;
type ProfileErrors = Partial<Record<keyof ProfileData, string[]>>;

interface State {
  loading: boolean;
  savingColor: boolean;
  savingInfo: boolean;
  success: boolean;
  data: ProfileData;
  errors: ProfileErrors;
  message?: string;
}

type Action =
  | { type: 'INIT_START' }
  | { type: 'INIT_SUCCESS'; payload: ProfileData }
  | { type: 'INIT_ERROR'; message: string }
  | { type: 'SET_FIELD'; field: keyof ProfileData; value: string }
  | { type: 'SET_ERRORS'; errors: ProfileErrors }
  | { type: 'SAVE_COLOR_START' }
  | { type: 'SAVE_COLOR_SUCCESS' }
  | { type: 'SAVE_COLOR_ERROR'; message: string }
  | { type: 'SAVE_INFO_START' }
  | { type: 'SAVE_INFO_SUCCESS' }
  | { type: 'SAVE_INFO_ERROR'; message: string };

const initialState: State = {
  loading: true,
  savingColor: false,
  savingInfo: false,
  success: false,
  data: { profileColor: '#cccccc', firstName: '', lastName: '', email: '' },
  errors: {},
  message: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, loading: true, errors: {}, message: undefined, success: false };
    case 'INIT_SUCCESS':
      return { ...state, loading: false, data: action.payload, success: false };
    case 'INIT_ERROR':
      return { ...state, loading: false, message: action.message, success: false };
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
        message: undefined,
        success: false,
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors, loading: false, success: false };
    case 'SAVE_COLOR_START':
      return { ...state, savingColor: true, message: undefined, success: false };
    case 'SAVE_COLOR_SUCCESS':
      return { ...state, savingColor: false, message: 'Votre couleur de profil a bien été mis à jour.', success: true };
    case 'SAVE_COLOR_ERROR':
      return { ...state, savingColor: false, message: action.message, success: false };
    case 'SAVE_INFO_START':
      return { ...state, savingInfo: true, message: undefined, success: false };
    case 'SAVE_INFO_SUCCESS':
      return { ...state, savingInfo: false, message: 'Votre profil a bien été mis à jour.', success: true };
    case 'SAVE_INFO_ERROR':
      return { ...state, savingInfo: false, message: action.message, success: false };
    default:
      return state;
  }
}

export default function ProfileColorPicker() {
  const {
    state: { currentUser },
  } = useAuth();
  const userId = currentUser?.sub;
  const [state, dispatch] = useReducer(reducer, initialState);

  // derive initials from state.data
  const initials = (
    `${state.data.firstName[0] ?? ''}${state.data.lastName[0] ?? ''}`
  ).toUpperCase();

  useEffect(() => {
    if (!userId) return;
    dispatch({ type: 'INIT_START' });
    api
      .get(`/users/${userId}`)
      .then(res =>
        dispatch({ type: 'INIT_SUCCESS', payload: {
          profileColor: res.data.profileColor || '#cccccc',
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
        }})
      )
      .catch(err =>
        dispatch({ type: 'INIT_ERROR', message: err?.response?.data?.message || 'Erreur de chargement' })
      );
  }, [userId]);

  const handleColorSave = async () => {
    // validate color
    const result = ProfileSchema.pick({ profileColor: true }).safeParse({ profileColor: state.data.profileColor });
    if (!result.success) {
      dispatch({ type: 'SET_ERRORS', errors: result.error.flatten().fieldErrors });
      return;
    }
    if (!userId) return;
    dispatch({ type: 'SAVE_COLOR_START' });
    try {
      await api.put(`/users/${userId}/color`, { profileColor: state.data.profileColor });
      dispatch({ type: 'SAVE_COLOR_SUCCESS' });
    } catch (err: any) {
      dispatch({ type: 'SAVE_COLOR_ERROR', message: err?.response?.data?.message || 'Échec couleur' });
    }
  };

  const handleInfoSave = async () => {
    // validate form
    const result = ProfileSchema.safeParse(state.data);
    if (!result.success) {
      dispatch({ type: 'SET_ERRORS', errors: result.error.flatten().fieldErrors });
      return;
    }
    if (!userId) return;
    dispatch({ type: 'SAVE_INFO_START' });
    try {
      await api.put(`/users/${userId}`, result.data);
      dispatch({ type: 'SAVE_INFO_SUCCESS' });
    } catch (err: any) {
      dispatch({ type: 'SAVE_INFO_ERROR', message: err?.response?.data?.message || 'Échec infos' });
    }
  };

  return (
    <div className="bg-base-200 px-4 py-12">
      <div className="card w-full max-w-sm mx-auto shadow-lg bg-base-100">
        <div className="card-body">
          {state.message && (
            <div className={`alert alert-soft mb-4 ${state.success ? 'alert-success' : 'alert-error'}`}>
              <span>{state.message}</span>
            </div>
          )}
          <form className="space-y-4">
            {/* color picker */}
            <div className="form-control flex flex-col items-center">
              <label className="relative mb-2">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white border-2" style={{ backgroundColor: state.data.profileColor }}>
                  {initials}
                </div>
                <input type="color" value={state.data.profileColor} disabled={state.savingColor} onChange={e => dispatch({ type: 'SET_FIELD', field: 'profileColor', value: e.target.value })} className="absolute inset-0 w-full h-full opacity-0" />
              </label>
              {state.errors.profileColor && <FormErrorMessage>{state.errors.profileColor.join(', ')}</FormErrorMessage>}
              <button type="button" onClick={handleColorSave} disabled={state.savingColor} className={`btn btn-sm btn-soft w-full ${state.savingColor ? 'loading' : ''}`}>{state.savingColor ? 'Enregistrement couleur...' : 'Enregistrer la couleur'}</button>
            </div>
            {/* info fields */}
            <div className="form-control">
              <label className="label"><span className="label-text">Prénom</span></label>
              <input type="text" className="input input-bordered w-full" value={state.data.firstName} disabled={state.savingInfo} onChange={e => dispatch({ type: 'SET_FIELD', field: 'firstName', value: e.target.value })} />
              {state.errors.firstName && <FormErrorMessage>{state.errors.firstName.join(', ')}</FormErrorMessage>}
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Nom</span></label>
              <input type="text" className="input input-bordered w-full" value={state.data.lastName} disabled={state.savingInfo} onChange={e => dispatch({ type: 'SET_FIELD', field: 'lastName', value: e.target.value })} />
              {state.errors.lastName && <FormErrorMessage>{state.errors.lastName.join(', ')}</FormErrorMessage>}
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" className="input input-bordered w-full" value={state.data.email} disabled={state.savingInfo} onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })} />
              {state.errors.email && <FormErrorMessage>{state.errors.email.join(', ')}</FormErrorMessage>}
            </div>
            {/* save info button */}
            <button type="button" onClick={handleInfoSave} disabled={state.savingInfo} className={`btn btn-sm btn-soft w-full ${state.savingInfo ? 'loading' : ''}`}>{state.savingInfo ? 'Enregistrement infos...' : 'Sauvegarder'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
