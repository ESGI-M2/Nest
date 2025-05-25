import { MessageFormData, MessageFormErrors, MessageFormSchema } from "@/lib/definitions";
import { getSocket } from '@/lib/socket'

type SendMessageResponse =
  | { success: true }
  | { success: false; errors?: MessageFormErrors; message?: string };

export async function sendMessageAPI(
  formData: MessageFormData
): Promise<SendMessageResponse> {
  const validated = MessageFormSchema.safeParse(formData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const socket = getSocket();

    if (!socket) {
      throw new Error("Socket connection is not established.");
    }

    await new Promise<void>((resolve, reject) => {
      console.log("Sending message via socket:", validated.data);

      socket.emit(
        "message",
        {
          content: validated.data.content,
          recipientId: validated.data.recipientId || '0'
        },
        (response: { status: string; errors?: MessageFormErrors; message?: string }) => {
          if (response.status === "ok") {
            console.log("Message sent successfully:", response);
            resolve();
          } else {
            console.log("Error response from server:", response);
            reject(response);
          }
        }
      );
    });

    return { success: true };
  } catch (error: any) {
    const fieldErrors = error?.errors;
    if (fieldErrors) {
      return { errors: fieldErrors, success: false };
    }

    return {
      errors: undefined,
      success: false,
      message: error?.message || "Une erreur est survenue lors de l'envoi du message.",
    };
  }
}
