import {
  LoginFormData,
  LoginFormErrors,
  LoginFormSchema,
} from "@/lib/definitions";
import api from "@/lib/api";

type LoginResponse =
  | { success: true; token: string }
  | { success: false; errors?: LoginFormErrors; message?: string };

const emptyErrors = {};

export async function loginAPI(
  formData: LoginFormData
): Promise<LoginResponse> {
  const validated = LoginFormSchema.safeParse({
    email: formData.email,
    password: formData.password,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const response = await api.post("/auth/login", {
      email: validated.data.email,
      password: validated.data.password,
    });

    return { success: true, token: response.data.access_token };
  } catch (error: any) {
    const fieldErrors = error?.response?.data?.errors;

    if (fieldErrors) {
      return { errors: fieldErrors, success: false };
    }

    // If the error is not field-specific, return a generic error message
    if (error?.response?.data?.message) {
      return {
        errors: undefined,
        success: false,
        message: error.response.data.message,
      };
    }

    // Fallback for any other error
    return {
      errors: undefined,
      success: false,
      message: error.message || "Une erreur est survenue lors de la connexion.",
    };
  }
}