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
        <div className="flex h-screen items-center justify-center mx-auto">
            <Card className="min-w-md max-w-md">
                <CardHeader>
                    <CardTitle>Connexion</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
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
                            />
                            {state.errors.email && (
                                <FormErrorMessage>
                                    {state.errors.email}
                                </FormErrorMessage>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
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
                            />
                            {state.errors.password && (
                                <FormErrorMessage>
                                    {state.errors.password}
                                </FormErrorMessage>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Se connecter
                        </Button>

                        {state.success === false && state.message && (
                            <small className="text-red-500">
                                {state.message}
                            </small>
                        )}
                    </form>
                </CardContent>
                <CardFooter>
                    <small>
                        Pas encore de compte?&nbsp;
                        <Link
                            href="/register"
                            className="text-blue-500 font-bold"
                        >
                            Inscrivez-vous
                        </Link>
                    </small>
                </CardFooter>
            </Card>
        </div>
    );
}
