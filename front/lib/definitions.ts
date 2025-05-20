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
