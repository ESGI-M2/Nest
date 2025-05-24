"use client";

import Link from "next/link";
import { registerAPI } from "@/app/actions/register";
import { useReducer } from "react";
import { FormErrorMessage } from "@/components/ui/form/FormErrorMessage";
import { useRouter } from "next/navigation";
import {
    initialRegisterFormState,
    RegisterFormData,
    RegisterFormErrors,
    RegisterFormState,
} from "@/lib/definitions";

type Action =
    | { type: "FIELD_CHANGE"; field: keyof RegisterFormData; value: string }
    | { type: "SET_ERRORS"; errors: RegisterFormErrors }
    | { type: "SET_MESSAGE"; message?: string }
    | { type: "SET_SUCCESS"; success: boolean }
    | { type: "SET_LOADING"; loading: boolean }
    | { type: "RESET" };

function reducer(state: RegisterFormState, action: Action): RegisterFormState {
    switch (action.type) {
        case "FIELD_CHANGE":
            return {
                ...state,
                data: { ...state.data, [action.field]: action.value },
                errors: { ...state.errors, [action.field]: undefined }, // clear error on input change
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
            return initialRegisterFormState;
        default:
            return state;
    }
}

export default function Register() {
    const [state, dispatch] = useReducer(reducer, initialRegisterFormState);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        dispatch({ type: "SET_LOADING", loading: true });

        const response = await registerAPI(state.data);

        if (response.success) {
            dispatch({ type: "SET_SUCCESS", success: true });
            router.push("/login");
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
                    <h2 className="card-title justify-center">Inscription</h2>

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
                            <label className="label" htmlFor="firstName">
                                <span className="label-text">Prénom</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={state.data.firstName}
                                onChange={(e) =>
                                    dispatch({
                                        type: "FIELD_CHANGE",
                                        field: "firstName",
                                        value: e.target.value,
                                    })
                                }
                                className="input input-bordered w-full"
                            />
                            {state.errors.firstName && (
                                <FormErrorMessage>
                                    {state.errors.firstName}
                                </FormErrorMessage>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="lastName">
                                <span className="label-text">Nom</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={state.data.lastName}
                                onChange={(e) =>
                                    dispatch({
                                        type: "FIELD_CHANGE",
                                        field: "lastName",
                                        value: e.target.value,
                                    })
                                }
                                className="input input-bordered w-full"
                            />
                            {state.errors.lastName && (
                                <FormErrorMessage>
                                    {state.errors.lastName}
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
                            S'inscrire
                        </button>

                        {state.success === false && state.message && (
                            <small className="text-error">
                                {state.message}
                            </small>
                        )}
                    </form>

                    <div className="text-center mt-4">
                        <small>
                            Vous avez déjà un compte?&nbsp;
                            <Link
                                href="/login"
                                className="text-primary font-bold"
                            >
                                Connectez-vous
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}
