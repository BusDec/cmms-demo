import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value: number, compact = false) {
  if (compact && Math.abs(value) >= 1_000_000_000) {
    return `SAR ${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (compact && Math.abs(value) >= 1_000_000) {
    return `SAR ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `SAR ${(value / 1_000).toFixed(0)}k`;
  }
  return `SAR ${formatNumber(value)}`;
}

export function formatPercent(value: number, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

export function formatHours(value: number) {
  return `${value.toFixed(1)} hrs`;
}

export function toneClass(tone: string) {
  switch (tone) {
    case "good":
      return "text-good";
    case "warn":
      return "text-warn";
    case "bad":
      return "text-bad";
    case "info":
      return "text-info";
    default:
      return "text-muted";
  }
}

export function toneBorder(tone: string) {
  switch (tone) {
    case "good":
      return "border-t-good";
    case "warn":
      return "border-t-warn";
    case "bad":
      return "border-t-bad";
    case "info":
      return "border-t-info";
    default:
      return "border-t-line-strong";
  }
}

export function statusTone(status: string): "good" | "warn" | "bad" | "info" | "neutral" {
  const value = status.toLowerCase();
  if (value.includes("closed") || value.includes("complete") || value.includes("active")) return "good";
  if (value.includes("overdue") || value.includes("critical")) return "bad";
  if (value.includes("await") || value.includes("hold") || value.includes("open")) return "warn";
  if (value.includes("planned") || value.includes("analysis")) return "info";
  return "neutral";
}
