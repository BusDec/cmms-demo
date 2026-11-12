import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  subtitle,
  children,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card overflow-hidden", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h2>
          {subtitle ? <p className="mt-1 text-[12px] text-muted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="px-3 pb-3 pt-2">{children}</div>
    </section>
  );
}
