'use client';

import React, { useEffect, useReducer } from "react";
import api from "@/lib/api";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import ConversationPreview from "./conversation-preview";

type Conversation = {
    id: string;
    name: string;
    createdAt: string;
};

type ConversationListState = {
    data: Conversation[];
    loading: boolean;
    error?: string;
};

const initialConversationListState: ConversationListState = {
    data: [],
    loading: false,
    error: undefined,
};

type Action =
    | { type: "SET_CONVERSATIONS"; conversations: Conversation[] }
    | { type: "SET_ERROR"; message: string }
    | { type: "SET_LOADING"; loading: boolean };

function reducer(
    state: ConversationListState,
    action: Action
): ConversationListState {
    switch (action.type) {
        case "SET_CONVERSATIONS":
            return {
                ...state,
                data: action.conversations,
                loading: false,
                error: undefined,
            };
        case "SET_ERROR":
            return { ...state, error: action.message, loading: false };
        case "SET_LOADING":
            return { ...state, loading: action.loading };
        default:
            return state;
    }
}

type ConversationListProps = {
    onConversationClick?: (conversationId: string) => void;
};

export default function ConversationList() {
    const [state, dispatch] = useReducer(reducer, initialConversationListState);

    useEffect(() => {
        const fetchConversations = async () => {
            dispatch({ type: "SET_LOADING", loading: true });

            try {
                const response = await api.get<Conversation[]>(
                    "/conversations"
                );
                dispatch({
                    type: "SET_CONVERSATIONS",
                    conversations: response.data,
                });
            } catch (error: any) {
                dispatch({
                    type: "SET_ERROR",
                    message:
                        error?.response?.data?.message ||
                        "Failed to fetch conversations",
                });
            }
        };

        fetchConversations();
    }, []);

    const router = useRouter();
    const handleClick = (id: string) => {
        router.push(`/chat/${id}`);
    };

    if (state.data.length === 0 && !state.loading) {
        return null;
    }

    if (state.loading) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="w-full bg-base-100 rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Conversations</h2>

            {state.loading && <p>Chargement...</p>}
            {state.error && <p className="text-error">{state.error}</p>}

            <ul className="space-y-2">
                {state.data.map((conv) => (
                    <ConversationPreview
                        key={conv.id}
                        onClick={() => handleClick(conv.id)}
                        conversation={conv}
                    />
                ))}
            </ul>
        </div>
    );
}
