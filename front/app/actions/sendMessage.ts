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

    console.log("Sending message:", validated.data);
    console.log("Socket connection status:", socket);

    await new Promise<void>((resolve, reject) => {
        socket.emit(
            "message",
            {
                content: validated.data.content,
                conversationId: validated.data.conversationId,
            },
            (response: {
                status: string;
                errors?: MessageFormErrors;
                message?: string;
            }) => {
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
    console.error("Error sending message:", error);
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
