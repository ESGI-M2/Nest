'use client';

import SendMessageForm from "@/components/ui/chat/SendMessageForm";
import { useParams } from "next/navigation";
import { useEffect, useReducer, useRef, useState } from "react";
import { z } from "zod";
import api from "@/lib/api";
import { fetchConversationMessages } from "./actions";
import { ChatMessageBubble } from "@/components/ui/chat/ChatMessageBubble";
import { useAuth } from "@/context/authContext";
import { getSocket } from "@/lib/socket";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

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

type ConversationUser = {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        profileColor: string | null;
    };
};

type Conversation = {
    id: string;
    name: string | null;
    createdAt: string;
    users: ConversationUser[];
};

export default function ChatPage() {
    const { conversation: conversationId } = useParams() as {
        conversation: string;
    };
    const [state, dispatch] = useReducer(reducer, initialMessagesState);
    const { state: authState } = useAuth();
    const [conv, setConv] = useState<Conversation | null>(null);
    const [convLoading, setConvLoading] = useState(false);
    const [convError, setConvError] = useState<string>();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch conversation metadata
    useEffect(() => {
        if (!conversationId) return;
        setConvLoading(true);
        api.get<Conversation>(`/conversations/${conversationId}`)
            .then((res) => {
                setConv(res.data);
                setConvError(undefined);
            })
            .catch((err) =>
                setConvError(
                    err?.response?.data?.message ||
                        "Impossible de charger la conversation"
                )
            )
            .finally(() => setConvLoading(false));
    }, [conversationId]);

    // Fetch initial messages
    useEffect(() => {
        if (!conversationId) return;
        dispatch({ type: "SET_LOADING", loading: true });
        fetchConversationMessages(conversationId).then((response) => {
            if (response.success) {
                dispatch({ type: "SET_MESSAGES", messages: response.messages });
            } else {
                dispatch({
                    type: "SET_ERROR",
                    message:
                        response.message || "Échec du chargement des messages",
                });
            }
        });
    }, [conversationId]);

    // Subscribe to socket for new messages
    useEffect(() => {
        if (!conversationId) return;
        const socket = getSocket();
        const handleNewMessage = (msg: MessageType) => {
            if (msg.conversationId === conversationId) {
                dispatch({ type: "ADD_MESSAGE", message: msg });
            }
        };
        socket.on("message", handleNewMessage);
        return () => {
            socket.off("message", handleNewMessage);
        };
    }, [conversationId]);

    // Auto‐scroll to bottom on new messages
    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        }
    }, [state.data]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
            {/* Conversation Header */}
            <div className="p-4 border-b border-base-300">
                {convLoading ? (
                    <p>Chargement de la conversation…</p>
                ) : convError ? (
                    <p className="text-error">{convError}</p>
                ) : conv ? (
                    <>
                        <h2 className="text-xl font-semibold">
                            {conv.name ?? "Sans titre"}
                        </h2>
                        <div className="flex -space-x-2">
                            {conv.users.map(({ user }) => (
                                <div
                                    key={user.id}
                                    className="w-7 h-7 rounded-full border-2 border-base-100"
                                    style={{
                                        backgroundColor:
                                            user.profileColor ?? "#888",
                                    }}
                                >
                                    <span className="block w-full h-full flex items-center justify-center text-xs font-bold text-white">
                                        {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : null}
            </div>

            {/* Message List */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-auto p-4 space-y-2"
                >
                    {state.loading && <p>Chargement…</p>}
                    {state.error && <p className="text-error">{state.error}</p>}
                    {state.data.map((msg) => (
                        <ChatMessageBubble
                            key={msg.id}
                            name={msg.sender.firstName}
                            content={msg.content}
                            fromMe={msg.sender.id === authState.currentUser?.id}
                            profileColor={msg.sender.profileColor}
                            firstLetter={`${msg.sender.firstName[0]}${msg.sender.lastName[0]}`.toUpperCase()}
                            dateTime={formatDistanceToNow(
                                new Date(msg.createdAt),
                                {
                                    addSuffix: true,
                                    locale: fr,
                                }
                            )}
                        />
                    ))}
                </div>

                {/* Send form stays pinned at bottom */}
                <SendMessageForm conversationId={conversationId} />
            </div>
        </div>
    );
}
