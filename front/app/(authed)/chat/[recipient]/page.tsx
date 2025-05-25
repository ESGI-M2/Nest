'use client';

import SendMessageForm from "@/components/ui/chat/SendMessageForm";
import { useParams } from "next/navigation";

export default function ChatPage() {
    const params = useParams();
    const recipientId = params?.recipient as string;

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4"></div>
            <SendMessageForm recipientId={recipientId} />
        </div>
    );
}
