"use client";

import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { createContext, useContext, useReducer, useEffect } from "react";

type CurrentUser = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileColor: string | null;
};

type AuthState = {
    token: string | null;
    currentUser: CurrentUser | null;
    isAuthenticated: boolean;
    loading: boolean;
};

const initialAuthState: AuthState = {
    token: null,
    currentUser: null,
    isAuthenticated: false,
    loading: true,
};

type AuthAction =
    | { type: "LOGIN"; token: string; user: CurrentUser }
    | { type: "LOGOUT" }
    | { type: "SET_LOADING"; loading: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                token: action.token,
                currentUser: action.user,
                isAuthenticated: true,
                loading: false,
            };
        case "LOGOUT":
            return {
                ...state,
                token: null,
                currentUser: null,
                isAuthenticated: false,
                loading: false,
            };
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
    login: (token: string, user: CurrentUser) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    state: initialAuthState,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    useEffect(() => {
        const checkUser = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    const response = await api.get("/users/me", {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });
                    const user: CurrentUser = response.data;
                    dispatch({ type: "LOGIN", token: storedToken, user });
                } catch (error) {
                    console.error("Failed to fetch user info", error);
                    localStorage.removeItem("token");
                    dispatch({ type: "LOGOUT" });
                }
            } else {
                dispatch({ type: "SET_LOADING", loading: false });
            }
        };

        checkUser();
    }, []);

    const login = (token: string, user: CurrentUser) => {
        localStorage.setItem("token", token);
        dispatch({ type: "LOGIN", token, user });
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            const socket = await getSocket();
            if (socket) {
                socket.disconnect();
                socket.close();
            }
        } catch (error) {
            console.error("Logout failed", error);
        }
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
    };

    return (
        <AuthContext.Provider value={{ state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
