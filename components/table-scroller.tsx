import { cn } from "@/lib/utils";

export function TableScroller({
  children,
  label = "Scrollable table",
  className,
  showHint = true,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
  showHint?: boolean;
}) {
  return (
    <div className={cn(className)}>
      {showHint ? (
        <p className="px-4 pb-1 pt-1 text-[10px] text-muted sm:hidden">
          Swipe to see all columns →
        </p>
      ) : null}
      <div
        className="table-scroll overflow-x-auto"
        tabIndex={0}
        role="region"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  );
}
