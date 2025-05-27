"use client";

import api from "@/lib/api";
import { CurrentUser } from "@/lib/definitions";
import { getSocket } from "@/lib/socket";
import { createContext, useContext, useReducer, useEffect } from "react";

type AuthState = {
    currentUser: CurrentUser | null;
    isAuthenticated: boolean;
    loading: boolean;
};

const initialAuthState: AuthState = {
    currentUser: null,
    isAuthenticated: false,
    loading: true,
};

type AuthAction =
    | { type: "LOGIN"; user: CurrentUser }
    | { type: "LOGOUT" }
    | { type: "UPDATE_USER"; user: CurrentUser }
    | { type: "SET_LOADING"; loading: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                currentUser: action.user,
                isAuthenticated: true,
                loading: false,
            };
        case "LOGOUT":
            return {
                ...state,
                currentUser: null,
                isAuthenticated: false,
                loading: false,
            };
        case "UPDATE_USER":
            return { ...state, currentUser: action.user };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
}

type AuthContextType = {
    state: AuthState;
    login: (user: CurrentUser) => void;
    logout: () => void;
    updateUser: (user: CurrentUser) => void;
};

const AuthContext = createContext<AuthContextType>({
    state: initialAuthState,
    login: () => {},
    logout: () => {},
    updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await api.get("/users/me");
                const user: CurrentUser = response.data;

                dispatch({
                    type: "UPDATE_USER",
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profileColor: user.profileColor || null,
                    },
                });
            } catch (error) {
                dispatch({ type: "LOGOUT" });
            }
        };

        checkUser();
    }, []);

    const login = (user: CurrentUser) => {
        dispatch({ type: "LOGIN", user });
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            const socket = await getSocket();
            if (socket) {
                await socket.disconnect();
                await socket.close();
            }
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Logout failed", error);
        }
        dispatch({ type: "LOGOUT" });
    };

    const updateUser = (user: CurrentUser) => {
        console.log("Updating user in context", user);
        dispatch({ type: "UPDATE_USER", user });
    };

    return (
        <AuthContext.Provider value={{ state, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
