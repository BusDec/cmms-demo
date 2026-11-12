import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  subtitle,
  children,
  action,
  footer,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card flex h-full flex-col overflow-hidden", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2 px-4 pt-3.5">
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold tracking-[-0.01em]">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-2.5 pt-1">
        {children}
      </div>
      {footer ? <div className="mt-auto px-2.5 pb-3">{footer}</div> : null}
    </section>
  );
}
