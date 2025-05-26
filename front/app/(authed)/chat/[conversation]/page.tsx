'use client';

import SendMessageForm from "@/components/ui/chat/SendMessageForm";
import { useParams } from "next/navigation";
import { useEffect, useReducer } from "react";
import { z } from "zod";
import { fetchConversationMessages } from "./actions";
import { ChatMessageBubble } from "@/components/ui/chat/ChatMessageBubble";
import { useAuth } from "@/context/authContext";
import { getSocket } from "@/lib/socket";

export const Message = z.object({
    id: z.string(),
    content: z.string(),
    conversationId: z.string(),
    createdAt: z.string(),
    sender: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        profileColor: z.string().nullable(),
    }),
});

export type MessageType = z.infer<typeof Message>;

export type MessagesState = {
    data: MessageType[];
    loading: boolean;
    error?: string;
};

export const initialMessagesState: MessagesState = {
    data: [],
    loading: false,
    error: undefined,
};

type Action =
    | { type: "SET_MESSAGES"; messages: MessageType[] }
    | { type: "ADD_MESSAGE"; message: MessageType }
    | { type: "SET_ERROR"; message: string }
    | { type: "SET_LOADING"; loading: boolean };

function reducer(state: MessagesState, action: Action): MessagesState {
    switch (action.type) {
        case "SET_MESSAGES":
            return {
                ...state,
                data: action.messages,
                loading: false,
                error: undefined,
            };
        case "ADD_MESSAGE":
            return { ...state, data: [...state.data, action.message] };
        case "SET_ERROR":
            return { ...state, error: action.message, loading: false };
        case "SET_LOADING":
            return { ...state, loading: action.loading };
        default:
            return state;
    }
}

export default function ChatPage() {
    const params = useParams();
    const conversationId = params?.conversation as string;
    const [state, dispatch] = useReducer(reducer, initialMessagesState);
    const { state: authState } = useAuth();

    useEffect(() => {
        if (!conversationId) return;

        const fetchData = async () => {
            dispatch({ type: "SET_LOADING", loading: true });
            const response = await fetchConversationMessages(conversationId);
            if (response.success) {
                dispatch({ type: "SET_MESSAGES", messages: response.messages });
            } else {
                dispatch({
                    type: "SET_ERROR",
                    message: response.message || "Failed to fetch messages",
                });
            }
        };

        fetchData();
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;
        const socket = getSocket();

        const handleNewMessage = (message: MessageType) => {
            if (message.conversationId === conversationId) {
                dispatch({ type: "ADD_MESSAGE", message });
            }
        };

        socket.on("message", handleNewMessage);

        return () => {
            socket.off("message", handleNewMessage);
        };
    }, [conversationId]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {state.loading && <p>Loading...</p>}
                {state.error && <p className="text-error">{state.error}</p>}
                {state.data.map((msg) => (
                    <ChatMessageBubble
                        key={msg.id}
                        content={msg.content}
                        fromMe={msg.senderId === authState.currentUser?.sub}
                    />
                ))}
            </div>
            <SendMessageForm conversationId={conversationId} />
        </div>
    );
}
