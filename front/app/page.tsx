import SendMessageForm from "@/components/ui/chat/SendMessageForm";
import { ChatMessageBubble } from "@/components/ui/chat/ChatMessageBubble";

export default function ChatPage({
    messages,
    currentUserId,
    recipientId,
}: {
    messages: {
        id: string;
        content: string;
        senderId: string;
        senderProfileColor?: string;
    }[];
    currentUserId: string;
    recipientId: string;
}) {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4">
                {messages &&
                    messages.map((msg) => (
                        <ChatMessageBubble
                            key={msg.id}
                            content={msg.content}
                            fromMe={msg.senderId === currentUserId}
                            profileColor={msg.senderProfileColor}
                        />
                    ))}
            </div>

            <SendMessageForm recipientId={recipientId} />
        </div>
    );
}
