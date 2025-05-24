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
        <div className="flex h-screen items-center justify-center mx-auto">
            <Card className="min-w-[400px]">
                <CardHeader>
                    <CardTitle>Inscription</CardTitle>
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
                            {state?.errors?.email && (
                                <FormErrorMessage>
                                    {state.errors.email}
                                </FormErrorMessage>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
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
                            />
                            {state?.errors?.firstName && (
                                <FormErrorMessage>
                                    {state.errors.firstName}
                                </FormErrorMessage>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
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
                            />
                            {state?.errors?.lastName && (
                                <FormErrorMessage>
                                    {state.errors.lastName}
                                </FormErrorMessage>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
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
                            {state?.errors?.password && (
                                <FormErrorMessage>
                                    {state.errors.password}
                                </FormErrorMessage>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            S'inscrire
                        </Button>

                        {state?.success === false && state?.message && (
                            <small className="text-red-500">
                                {state.message}
                            </small>
                        )}
                    </form>
                </CardContent>
                <CardFooter>
                    <small>
                        Vous avez déjà un compte?&nbsp;
                        <Link href="/login" className="text-blue-500 font-bold">
                            Connectez vous
                        </Link>
                    </small>
                </CardFooter>
            </Card>
        </div>
    );
}
