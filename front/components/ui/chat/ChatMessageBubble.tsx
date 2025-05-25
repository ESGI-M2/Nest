type ChatMessageProps = {
  content: string;
  fromMe: boolean;
  profileColor?: string;
};

export function ChatMessageBubble({
  content,
  fromMe,
  profileColor,
}: ChatMessageProps) {
  return (
    <div className={`flex ${fromMe ? "justify-end" : "justify-start"} my-1`}>
      {!fromMe && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2"
          style={{ backgroundColor: profileColor || "#aaa" }}
        >
          {/* Initial or avatar placeholder */}
        </div>
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
