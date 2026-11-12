import { ChevronDown } from "lucide-react";

export function MoreAnalysis({
  children,
  count,
  label = "More analysis",
}: {
  children: React.ReactNode;
  count: number;
  label?: string;
}) {
  return (
    <details className="group card overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[12px] font-semibold text-muted transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
        <span>
          {label}
          <span className="ml-2 font-normal text-muted">
            {count} {count === 1 ? "view" : "views"}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.08em]">
          <span className="group-open:hidden">Open</span>
          <span className="hidden group-open:inline">Close</span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-line p-3">{children}</div>
    </details>
  );
}
