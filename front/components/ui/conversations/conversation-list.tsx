"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ConversationPreview from "./conversation-preview";
import {
    useConversations,
    useConversationsLoading,
    useConversationError,
} from "@/context/conversationContext";

export default function ConversationList() {
    const convs = useConversations();
    const loading = useConversationsLoading();
    const error = useConversationError();
    const router = useRouter();

    const handleClick = (id: string) => {
        router.push(`/chat/${id}`);
    };

    return (
        <div className="w-full bg-base-100 rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Conversations</h2>

            {loading && <p>Chargement...</p>}
            {error && <p className="text-error">{error}</p>}

            <ul className="space-y-2">
                {convs.map((conv) => (
                    <ConversationPreview
                        key={conv.id}
                        conversation={conv}
                        onClick={() => handleClick(conv.id)}
                    />
                ))}
            </ul>
        </div>
    );
}
