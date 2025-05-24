import { z } from 'zod'

export const RegisterFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères.' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Veuillez entrer une adresse e-mail valide.' })
    .trim(),
  password: z
    .string()

    .trim(),
})

export type RegisterFormData = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
};

export type RegisterFormErrors = Partial<
    Record<keyof RegisterFormData, string[]>
>;

export type RegisterFormState = {
    data: RegisterFormData;
    errors: RegisterFormErrors;
    message?: string;
    success: boolean;
    loading: boolean;
};

export const initialRegisterFormState: RegisterFormState = {
    data: {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    },
    errors: {},
    message: undefined,
    success: false,
    loading: false,
};

export const LoginFormSchema = z.object({
    email: z
        .string()
        .email({ message: "Veuillez entrer une adresse e-mail valide." })
        .min(1, { message: "L'adresse e-mail ne doit pas être vide." })
        .trim(),
    password: z
        .string()
        .min(1, { message: "Le mot de passe ne doit pas être vide." })
        .trim(),
});

export type LoginFormData = {
    email: string;
    password: string;
};

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string[]>>;

export type LoginFormState = {
    data: LoginFormData;
    errors: LoginFormErrors;
    message?: string;
    success: boolean;
    loading: boolean;
};

export const initialLoginFormState: LoginFormState = {
    data: { email: "", password: "" },
    errors: {},
    message: undefined,
    success: false,
    loading: false,
};