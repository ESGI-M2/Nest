"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { loginAPI } from "@/app/actions/login";
import { useReducer } from "react";
import { FormErrorMessage } from "@/components/ui/form/FormErrorMessage";
import { useRouter } from "next/navigation";
import {
    initialLoginFormState,
    LoginFormData,
    LoginFormErrors,
    LoginFormState,
} from "@/lib/definitions";

type Action =
    | { type: "FIELD_CHANGE"; field: keyof LoginFormData; value: string }
    | { type: "SET_ERRORS"; errors: LoginFormErrors }
    | { type: "SET_MESSAGE"; message?: string }
    | { type: "SET_SUCCESS"; success: boolean }
    | { type: "SET_LOADING"; loading: boolean }
    | { type: "RESET" };

function reducer(state: LoginFormState, action: Action): LoginFormState {
    switch (action.type) {
        case "FIELD_CHANGE":
            return {
                ...state,
                data: { ...state.data, [action.field]: action.value },
                errors: { ...state.errors, [action.field]: undefined },
                message: undefined,
                success: false,
            };
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.errors,
                loading: false,
                success: false,
            };
        case "SET_MESSAGE":
            return {
                ...state,
                message: action.message,
                loading: false,
                success: false,
            };
        case "SET_SUCCESS":
            return {
                ...state,
                success: action.success,
                loading: false,
                errors: {},
                message: undefined,
            };
        case "SET_LOADING":
            return { ...state, loading: action.loading };
        case "RESET":
            return initialLoginFormState;
        default:
            return state;
    }
}

export default function Login() {
    const [state, dispatch] = useReducer(reducer, initialLoginFormState);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        dispatch({ type: "SET_LOADING", loading: true });

        const response = await loginAPI(state.data);

        if (response.success) {
            dispatch({ type: "SET_SUCCESS", success: true });
            router.push("/");
        } else if (response.errors) {
            dispatch({ type: "SET_ERRORS", errors: response.errors });
        } else {
            dispatch({
                type: "SET_MESSAGE",
                message: response.message || "Erreur inconnue.",
            });
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-sm shadow-lg bg-base-100">
                <div className="card-body">
                    <h2 className="card-title justify-center">Connexion</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label" htmlFor="email">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={state.data.email}
                                onChange={(e) =>
                                    dispatch({
                                        type: "FIELD_CHANGE",
                                        field: "email",
                                        value: e.target.value,
                                    })
                                }
                                className="input input-bordered w-full"
                            />
                            {state.errors.email && (
                                <FormErrorMessage>
                                    {state.errors.email}
                                </FormErrorMessage>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="password">
                                <span className="label-text">Mot de passe</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={state.data.password}
                                onChange={(e) =>
                                    dispatch({
                                        type: "FIELD_CHANGE",
                                        field: "password",
                                        value: e.target.value,
                                    })
                                }
                                className="input input-bordered w-full"
                            />
                            {state.errors.password && (
                                <FormErrorMessage>
                                    {state.errors.password}
                                </FormErrorMessage>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Se connecter
                        </button>

                        {state.success === false && state.message && (
                            <small className="text-error">
                                {state.message}
                            </small>
                        )}
                    </form>

                    <div className="text-center mt-4">
                        <small>
                            Pas encore de compte?&nbsp;
                            <Link
                                href="/register"
                                className="text-primary font-bold"
                            >
                                Inscrivez-vous
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}
