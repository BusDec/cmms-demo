import { cn } from "@/lib/utils";

type Tone = "good" | "warn" | "bad" | "info" | "neutral";

const tones: Record<Tone, string> = {
  good: "bg-[#e6f4f1] text-good",
  warn: "bg-[#fdf1e3] text-warn",
  bad: "bg-[#fbe9e9] text-bad",
  info: "bg-[#e8eefc] text-info",
  neutral: "bg-[#eef2f7] text-muted",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
