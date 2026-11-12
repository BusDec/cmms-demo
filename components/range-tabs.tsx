"use client";

import { cn } from "@/lib/utils";

const options = [
  { value: 3, label: "3M" },
  { value: 6, label: "6M" },
  { value: 12, label: "12M" },
];

export function RangeTabs({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full border border-line bg-surface p-0.5"
      role="group"
      aria-label="Trend window"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
            value === option.value
              ? "bg-ink text-white"
              : "text-muted hover:text-ink",
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
