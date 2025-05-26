'use client';

import React, { useEffect, useReducer } from "react";
import api from "@/lib/api";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileColor: string | null;
};

type UserListState = {
  data: User[];
  loading: boolean;
  error?: string;
};

const initialUserListState: UserListState = {
  data: [],
  loading: false,
  error: undefined,
};

type Action =
  | { type: "SET_USERS"; users: User[] }
  | { type: "SET_ERROR"; message: string }
  | { type: "SET_LOADING"; loading: boolean };

function reducer(state: UserListState, action: Action): UserListState {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, data: action.users, loading: false, error: undefined };
    case "SET_ERROR":
      return { ...state, error: action.message, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

type UserListProps = {
  onUserClick?: (userId: string) => void;
};

export default function UserList({ onUserClick }: UserListProps) {
  const [state, dispatch] = useReducer(reducer, initialUserListState);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: "SET_LOADING", loading: true });

      try {
        const response = await api.get("/users");
        dispatch({ type: "SET_USERS", users: response.data });
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          message: error?.response?.data?.message || "Failed to fetch users",
        });
      }
    };

    fetchUsers();
  }, []);

  return (
      <div className="w-full bg-base-100 rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Utilisateurs</h2>

          {state.loading && <p>Chargement...</p>}
          {state.error && <p className="text-error">{state.error}</p>}

          <ul className="space-y-2">
              {state.data.map((user) => (
                  <li
                      key={user.id}
                      className="flex items-center gap-2 p-2 bg-base-100 rounded cursor-pointer hover:bg-base-300 transition"
                      onClick={() => onUserClick?.(user.id)}
                  >
                      <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                              backgroundColor: user.profileColor || "#ccc",
                          }}
                      >
                          <span className="text-xs font-bold text-white">
                              {user.firstName[0]}
                          </span>
                      </div>

                      <div>
                          <p className="font-medium">
                              {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                  </li>
              ))}
          </ul>
      </div>
  );
}
