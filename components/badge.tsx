import { cn } from "@/lib/utils";

type Tone = "good" | "warn" | "bad" | "info" | "neutral";

const tones: Record<Tone, string> = {
  good: "bg-[rgba(79,209,197,0.12)] text-good",
  warn: "bg-[rgba(232,163,61,0.12)] text-warn",
  bad: "bg-[rgba(249,112,102,0.12)] text-bad",
  info: "bg-[rgba(127,176,255,0.12)] text-info",
  neutral: "bg-[rgba(234,242,246,0.08)] text-muted",
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
