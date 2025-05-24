import {
    RegisterFormData,
    RegisterFormErrors,
    RegisterFormSchema,
} from "@/lib/definitions";
import api from "@/lib/api";

type RegisterResponse =
    | { success: true }
    | { success: false; errors?: RegisterFormErrors; message?: string };

const emptyErrors = {};

export async function registerAPI(
    formData: RegisterFormData
): Promise<RegisterResponse> {
    const validatedFields = RegisterFormSchema.safeParse({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
    });

    console.log("Validated Fields:", validatedFields);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
            message: undefined,
        };
    }

    try {
        await api.post("/auth/register", {
            email: validatedFields.data.email,
            firstName: validatedFields.data.firstName,
            lastName: validatedFields.data.lastName,
            password: validatedFields.data.password,
        });

        return {
            success: true,
        };
    } catch (error: any) {
        const fieldErrors = error?.response?.data?.errors;

        if (fieldErrors) {
            return {
                errors: fieldErrors,
                success: false,
                message: undefined,
            };
        }

        return {
            errors: emptyErrors,
            success: false,
            message: "Une erreur est survenue lors de l'inscription.",
        };
    }
}
