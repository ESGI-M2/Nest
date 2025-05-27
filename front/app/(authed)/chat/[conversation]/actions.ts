import api from "@/lib/api";

export async function fetchConversationMessages(conversationId: string) {
  try {
    const response = await api.get(`/conversations/${conversationId}/messages`);

    if (response.status === 200) {
      return { success: true, messages: response.data };
    } else {
      return { success: false, message: "Failed to fetch messages" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error fetching messages" };
  }
}