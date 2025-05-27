'use client';

import NewConversation from "@/components/ui/conversations/new-conversation";

export default function ChatPage() {
    return (
        <div
            className="hero min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]"
            style={{
                backgroundImage:
                    "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
            }}
        >
            <div className="hero-overlay"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <p>🚫 Ce n’est pas 🚫</p>
                    <h1 className="mb-5 text-5xl font-bold">ChatGPT !</h1>
                    <p className="mb-5">
                        Ici, pas de réponses générées par IA, mais de vrais
                        humains qui papotent, rient (ou pleurent).
                    </p>
                    <NewConversation />
                </div>
            </div>
        </div>
    );
}
