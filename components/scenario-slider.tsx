"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function ScenarioSlider({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  minLabel,
  maxLabel,
  onChange,
  readout,
  footnote = "Illustrative model · not a live forecast",
  tone = "warn",
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display: string;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
  readout?: React.ReactNode;
  footnote?: string;
  tone?: "warn" | "info";
  className?: string;
}) {
  const id = useId();

  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-[var(--panel-strong)] px-3 py-2.5",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted"
        >
          {label}
        </label>
        <span
          className={cn(
            "tabular text-[13px] font-semibold",
            tone === "warn" ? "text-warn" : "text-info",
          )}
        >
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="atlas-range mt-2 w-full"
      />
      {minLabel || maxLabel ? (
        <div className="mt-0.5 flex justify-between text-[10px] text-muted">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
      {readout ? (
        <div className="mt-1.5 text-[11px] leading-snug text-ink/85">{readout}</div>
      ) : null}
      {footnote ? <p className="mt-1 text-[10px] leading-snug text-muted">{footnote}</p> : null}
    </div>
  );
}
