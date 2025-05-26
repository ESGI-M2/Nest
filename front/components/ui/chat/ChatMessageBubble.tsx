import { Bubble } from "../bubble";

type ChatMessageProps = {
  content: string;
  fromMe: boolean;
  profileColor?: string;
  firstLetter: string;
};

export function ChatMessageBubble({
    name,
    content,
    fromMe,
    profileColor,
    firstLetter,
    dateTime,
}: ChatMessageProps) {
    return (
        <div className={`chat ${fromMe ? "chat-end" : "chat-start"}`}>
            <div className="chat-image">
                {!fromMe && (
                    <Bubble
                        firstLetter={firstLetter}
                        profileColor={profileColor}
                    />
                )}
            </div>
            <div className="chat-header">{fromMe ? "" : name}</div>
            <div
                className={`chat-bubble ${fromMe ? "chat-bubble-primary" : ""}`}
            >
                {content}
            </div>
            <div className="chat-footer opacity-50">{dateTime}</div>
        </div>
    );
}
