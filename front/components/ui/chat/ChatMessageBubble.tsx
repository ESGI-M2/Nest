import { Bubble } from "../bubble";

type ChatMessageProps = {
  content: string;
  fromMe: boolean;
  profileColor?: string;
  firstLetter: string;
};

export function ChatMessageBubble({
  content,
  fromMe,
  profileColor,
  firstLetter,
}: ChatMessageProps) {
  return (
    <div className={`flex ${fromMe ? "justify-end" : "justify-start"} my-1`}>
      {!fromMe && (
        <Bubble
          firstLetter={firstLetter}
          profileColor={profileColor}
        />
      )}
      <div
        className={`rounded-xl px-3 py-2 max-w-[60%] ${
          fromMe
            ? "bg-primary text-white"
            : "bg-base-200 text-base-content"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
