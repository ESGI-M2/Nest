'use client';

import React, { useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type State = {
  users: User[];
  loadingUsers: boolean;
  error?: string;
  name: string;
  selected: string[];
  submitting: boolean;
};

const initialState: State = {
  users: [],
  loadingUsers: false,
  error: undefined,
  name: "",
  selected: [],
  submitting: false,
};

type Action =
  | { type: "SET_LOADING_USERS"; loading: boolean }
  | { type: "SET_USERS"; users: User[] }
  | { type: "SET_ERROR"; message: string }
  | { type: "SET_NAME"; name: string }
  | { type: "TOGGLE_USER"; userId: string }
  | { type: "SET_SUBMITTING"; submitting: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING_USERS":
      return { ...state, loadingUsers: action.loading };
    case "SET_USERS":
      return { ...state, users: action.users, loadingUsers: false, error: undefined };
    case "SET_ERROR":
      return { ...state, error: action.message, loadingUsers: false, submitting: false };
    case "SET_NAME":
      return { ...state, name: action.name };
    case "TOGGLE_USER":
      const selected = state.selected.includes(action.userId)
        ? state.selected.filter(id => id !== action.userId)
        : [...state.selected, action.userId];
      return { ...state, selected };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.submitting };
    default:
      return state;
  }
}

export default function NewConversation() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    dispatch({ type: "SET_LOADING_USERS", loading: true });
    api.get<User[]>("/users")
      .then(res => dispatch({ type: "SET_USERS", users: res.data }))
      .catch(err =>
        dispatch({
          type: "SET_ERROR",
          message: err?.response?.data?.message || "Erreur lors du chargement des utilisateurs",
        })
      );
  }, []);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.name || state.selected.length === 0) return;
    dispatch({ type: "SET_SUBMITTING", submitting: true });
    try {
      const res = await api.post("/conversations", {
        name: state.name,
        recipients: state.selected,
      });
      closeModal();
      router.push(`/chat/${res.data.id}`);
    } catch (err: any) {
      dispatch({
        type: "SET_ERROR",
        message: err?.response?.data?.message || "Erreur lors de la création",
      });
    } finally {
      dispatch({ type: "SET_SUBMITTING", submitting: false });
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={openModal}>
        Nouvelle conversation
      </button>

      <dialog ref={dialogRef} className="modal">
        <form onSubmit={handleSubmit} className="modal-box space-y-4">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </button>

          <h3 className="font-bold text-lg">Nouvelle conversation</h3>

          {state.error && (
            <p className="text-error">{state.error}</p>
          )}

          <input
            type="text"
            placeholder="Titre de la conversation"
            className="input input-bordered w-full"
            value={state.name}
            onChange={e => dispatch({ type: "SET_NAME", name: e.target.value })}
          />

          <div className="max-h-40 overflow-auto border rounded p-2">
            {state.loadingUsers ? (
              <p>Chargement des utilisateurs...</p>
            ) : (
              state.users.map(user => (
                <label
                  key={user.id}
                  className="flex items-center space-x-3 py-1"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={state.selected.includes(user.id)}
                    onChange={() => dispatch({ type: "TOGGLE_USER", userId: user.id })}
                  />
                  <span>
                    {user.firstName} {user.lastName} <span className="text-xs text-gray-500">({user.email})</span>
                  </span>
                </label>
              ))
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${state.submitting ? "loading" : ""}`}
            disabled={
              state.submitting ||
              !state.name ||
              state.selected.length === 0
            }
          >
            Créer
          </button>
        </form>
      </dialog>
    </>
  );
}
