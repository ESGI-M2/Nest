type BubbleProps = {
  firstLetter: string;
  profileColor?: string;
};

export function Bubble({ firstLetter, profileColor }: BubbleProps) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2"
      style={{ backgroundColor: profileColor || "#aaa" }}
    >
      {firstLetter}
    </div>
  );
}
