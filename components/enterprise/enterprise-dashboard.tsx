"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/badge";
import { StatCard } from "@/components/kpi-card";
import { TableScroller } from "@/components/table-scroller";
import {
  VERTICALS,
  getVertical,
  issuesFor,
  type EnterpriseView,
  type IssueSeverity,
  type IssueStatus,
} from "@/lib/enterprise";
import { getSystem } from "@/lib/landscape";
import { PORTFOLIO } from "@/lib/portfolio";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const viewOptions: { value: EnterpriseView; label: string }[] = [
  { value: "group", label: "Group" },
  ...VERTICALS.map((vertical) => ({ value: vertical.id, label: vertical.name })),
];

const severityRank: Record<IssueSeverity, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
};

function confidenceTone(value: number): "good" | "warn" | "bad" {
  if (value >= 85) return "good";
  if (value >= 70) return "warn";
  return "bad";
}

function confidenceBar(value: number) {
  const tone = confidenceTone(value);
  return tone === "good" ? "bg-good" : tone === "warn" ? "bg-warn" : "bg-bad";
}

function severityTone(severity: IssueSeverity) {
  if (severity === "Critical") return "bad" as const;
  if (severity === "High") return "warn" as const;
  return "neutral" as const;
}

function compactKpiMoney(value: number) {
  return formatCurrency(value, true).replace(".0M", "M");
}

function statusTone(status: IssueStatus) {
  if (status === "Rectified") return "good" as const;
  if (status === "In review") return "info" as const;
  if (status === "In correction") return "warn" as const;
  return "neutral" as const;
}

export function EnterpriseDashboard() {
  const [view, setView] = useState<EnterpriseView>("group");
  const [severity, setSeverity] = useState<"all" | IssueSeverity>("all");

  const summary = useMemo(() => {
    const rows = view === "group" ? VERTICALS : VERTICALS.filter((row) => row.id === view);
    const total = (read: (row: (typeof VERTICALS)[number]) => number) =>
      rows.reduce((sum, row) => sum + read(row), 0);
    const revenue = total((row) => row.revenue);
    const ebitda = total((row) => row.ebitda);
    const headcount = total((row) => row.headcount);
    const headcountPlan = total((row) => row.headcountPlan);
    const payrollCost = total((row) => row.payrollCost);
    const openIssues = total((row) => row.openIssues);
    const criticalIssues = total((row) => row.criticalIssues);
    const detectedThisMonth = total((row) => row.detectedThisMonth);
    const closedThisMonth = total((row) => row.closedThisMonth);
    const openRoles = total((row) => row.openRoles);
    const planRevenue = total((row) => row.revenue / (1 + row.revenueVsPlan / 100));
    const attrition = total((row) => row.attrition * row.headcount) / headcount;
    const absence = total((row) => row.absence * row.headcount) / headcount;
    const overtime = total((row) => row.overtime * row.headcount) / headcount;
    const dataConfidence = total((row) => row.dataConfidence * row.headcount) / headcount;
    const contractorShare = total((row) => row.contractorShare * row.headcount) / headcount;
    const costPerFte = payrollCost / headcount;
    const revenuePerFte = revenue / headcount;

    return {
      revenue,
      revenueVsPlan: (revenue / planRevenue - 1) * 100,
      ebitda,
      ebitdaMargin: (ebitda / revenue) * 100,
      headcount,
      headcountDelta: headcount - headcountPlan,
      payrollCost,
      payrollPct: (payrollCost / revenue) * 100,
      attrition,
      absence,
      overtime,
      costPerFte,
      revenuePerFte,
      openRoles,
      contractorShare,
      dataConfidence,
      openIssues,
      criticalIssues,
      detectedThisMonth,
      closedThisMonth,
    };
  }, [view]);

  const selectedVertical = view === "group" ? null : getVertical(view);
  const scopeIssues = useMemo(() => issuesFor(view), [view]);

  const visibleIssues = useMemo(() => {
    const filtered =
      severity === "all" ? scopeIssues : scopeIssues.filter((issue) => issue.severity === severity);
    return [...filtered].sort((a, b) => {
      if (a.status === "Rectified" && b.status !== "Rectified") return 1;
      if (b.status === "Rectified" && a.status !== "Rectified") return -1;
      return severityRank[a.severity] - severityRank[b.severity] || b.records - a.records;
    });
  }, [scopeIssues, severity]);

  const criticalAttention = useMemo(
    () =>
      scopeIssues
        .filter((issue) => issue.severity === "Critical" && issue.status !== "Rectified")
        .sort((a, b) => b.records - a.records),
    [scopeIssues],
  );

  const loopCorrection = scopeIssues.filter((issue) => issue.status === "In correction").length;
  const loopReview = scopeIssues.filter((issue) => issue.status === "In review").length;
  const hrOpen = scopeIssues.filter(
    (issue) => issue.domain === "HR" && issue.status !== "Rectified",
  ).length;
  const hrCritical = scopeIssues.filter(
    (issue) => issue.domain === "HR" && issue.severity === "Critical" && issue.status !== "Rectified",
  ).length;
  const hrIssues = scopeIssues
    .filter((issue) => issue.domain === "HR" && issue.status !== "Rectified")
    .sort((a, b) => severityRank[a.severity] - severityRank[b.severity] || b.records - a.records);

  const loop = [
    { label: "Detected", value: summary.detectedThisMonth, hint: "this month" },
    { label: "Open", value: summary.openIssues, hint: "owner assigned" },
    { label: "In correction", value: loopCorrection, hint: "records being fixed" },
    { label: "In review", value: loopReview, hint: "awaiting revalidation" },
    { label: "Certified", value: summary.closedThisMonth, hint: "closed this month" },
  ];

  const viewLabel = selectedVertical?.name ?? "Meridian Energy Group";
  const hasIssues = visibleIssues.length > 0;
  const remainingCritical = criticalAttention.length - Math.min(3, criticalAttention.length);

  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-14 pt-8 sm:px-8 lg:pt-10">
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">Meridian Energy Group · Enterprise command</p>
            <Badge tone="neutral">Synthetic dataset</Badge>
          </div>
          <h1 className="mt-2 max-w-[18ch] text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Every vertical. Every exception. One command view.
          </h1>
          <p className="measure mt-4 text-[14px] leading-relaxed text-muted">
            Directors see the full enterprise — revenue, cost, people and data
            confidence across Generation, Grid, Services and Retail. Every
            inconsistency carries a record count, an owner, a due date and a route to
            closure.
          </p>
          <div
            className="mt-6 flex flex-wrap gap-1.5"
            role="group"
            aria-label="Enterprise vertical"
          >
            {viewOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setView(option.value)}
                aria-pressed={view === option.value}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  view === option.value
                    ? "border-[var(--warn)] bg-[var(--warn)] text-[var(--graphite)]"
                    : "border-line bg-surface text-muted hover:text-ink",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-[var(--panel-strong)] p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                Command posture
              </p>
              <p className="mt-1 text-[12px] text-white/65">{viewLabel}</p>
            </div>
            <Badge tone={confidenceTone(summary.dataConfidence)}>
              {Math.round(summary.dataConfidence)}% confidence
            </Badge>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={cn("h-full rounded-full", confidenceBar(summary.dataConfidence))}
              style={{ width: `${summary.dataConfidence}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
            <div>
              <p className="tabular text-[20px] font-semibold">{summary.openIssues}</p>
              <p className="text-[10px] text-white/55">open issues</p>
            </div>
            <div>
              <p className="tabular text-[20px] font-semibold text-bad">
                {summary.criticalIssues}
              </p>
              <p className="text-[10px] text-white/55">critical</p>
            </div>
            <div>
              <p className="tabular text-[20px] font-semibold text-good">
                {summary.closedThisMonth}
              </p>
              <p className="text-[10px] text-white/55">closed this month</p>
            </div>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-white/55">
            The score is the share of records with no open exception. It rises only
            when the record count reaches zero.
          </p>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Revenue"
          value={compactKpiMoney(summary.revenue)}
          hint={`${summary.revenueVsPlan >= 0 ? "+" : ""}${summary.revenueVsPlan.toFixed(1)}% vs plan`}
          tone={summary.revenueVsPlan >= 0 ? "good" : "warn"}
        />
        <StatCard
          label="EBITDA"
          value={compactKpiMoney(summary.ebitda)}
          hint={`${summary.ebitdaMargin.toFixed(1)}% margin`}
          tone={summary.ebitdaMargin >= 25 ? "good" : "warn"}
        />
        <StatCard
          label="Headcount"
          value={formatNumber(summary.headcount)}
          hint={`${summary.headcountDelta >= 0 ? "+" : ""}${formatNumber(summary.headcountDelta)} vs plan`}
        />
        <StatCard
          label="Payroll cost"
          value={compactKpiMoney(summary.payrollCost)}
          hint={`${summary.payrollPct.toFixed(1)}% of revenue`}
          tone={summary.payrollPct > 12 ? "warn" : "neutral"}
        />
        <StatCard
          label="Attrition"
          value={`${summary.attrition.toFixed(1)}%`}
          hint="Voluntary, 12-month"
          tone={summary.attrition > 8.5 ? "warn" : "neutral"}
        />
        <StatCard
          label="Open roles"
          value={formatNumber(summary.openRoles)}
          hint={`${Math.round(summary.contractorShare)}% contractor share`}
        />
      </section>

      <section className="mt-8">
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-line px-5 py-4">
            <div>
              <p className="eyebrow">Vertical performance</p>
              <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.02em]">
                Revenue, cost and confidence by business.
              </h2>
            </div>
            <p className="text-[11px] text-muted">All four verticals · FY26</p>
          </div>
          <TableScroller label="Vertical performance table">
            <table className="w-full min-w-[900px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-3 font-semibold">Vertical</th>
                  <th className="px-3 py-3 font-semibold">System</th>
                  <th className="px-3 py-3 text-right font-semibold">Revenue</th>
                  <th className="px-3 py-3 text-right font-semibold">EBITDA</th>
                  <th className="px-3 py-3 text-right font-semibold">Headcount</th>
                  <th className="px-3 py-3 text-right font-semibold">Payroll</th>
                  <th className="px-3 py-3 text-right font-semibold">Confidence</th>
                  <th className="px-4 py-3 text-right font-semibold">Open</th>
                </tr>
              </thead>
              <tbody>
                {VERTICALS.map((vertical) => {
                  const system = getSystem(vertical.system);
                  const active = view === vertical.id;
                  return (
                    <tr
                      key={vertical.id}
                      className={cn(
                        "border-b border-line/70 last:border-0",
                        active && "bg-[rgba(232,163,61,0.06)]",
                      )}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setView(active ? "group" : vertical.id)}
                          aria-pressed={active}
                          className="text-left font-semibold hover:text-warn"
                        >
                          {vertical.name}
                        </button>
                        <p className="mt-0.5 text-[10px] text-muted">
                          CC {vertical.companyCode}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={vertical.system === "hana" ? "good" : "neutral"}>
                          {system?.shortName ?? vertical.system}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <p className="tabular font-semibold">
                          {formatCurrency(vertical.revenue, true)}
                        </p>
                        <p
                          className={cn(
                            "mt-0.5 text-[10px]",
                            vertical.revenueVsPlan >= 0 ? "text-good" : "text-warn",
                          )}
                        >
                          {vertical.revenueVsPlan >= 0 ? "+" : ""}
                          {vertical.revenueVsPlan.toFixed(1)}% vs plan
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <p className="tabular font-semibold">
                          {formatCurrency(vertical.ebitda, true)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted">
                          {((vertical.ebitda / vertical.revenue) * 100).toFixed(1)}% margin
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <p className="tabular font-semibold">
                          {formatNumber(vertical.headcount)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted">
                          {vertical.headcount - vertical.headcountPlan >= 0 ? "+" : ""}
                          {formatNumber(vertical.headcount - vertical.headcountPlan)} vs plan
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <p className="tabular font-semibold">
                          {formatCurrency(vertical.payrollCost, true)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted">
                          {((vertical.payrollCost / vertical.revenue) * 100).toFixed(1)}% of revenue
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Badge tone={confidenceTone(vertical.dataConfidence)}>
                          {vertical.dataConfidence}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="tabular font-semibold">{vertical.openIssues}</p>
                        <p className="mt-0.5 text-[10px] text-bad">
                          {vertical.criticalIssues} critical
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroller>
          <p className="border-t border-line px-5 py-3 text-[10px] text-muted">
            Select a vertical name to filter the command posture, exception register
            and attention list. The comparison table stays whole.
          </p>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Data confidence</p>
                <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.02em]">
                  Trust by vertical.
                </h2>
              </div>
              <Badge tone={confidenceTone(summary.dataConfidence)}>
                {Math.round(summary.dataConfidence)}%
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              {VERTICALS.map((vertical) => {
                const active = view === vertical.id;
                return (
                  <button
                    key={vertical.id}
                    type="button"
                    onClick={() => setView(active ? "group" : vertical.id)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-md px-2 py-2 text-left transition-colors",
                      active ? "bg-[var(--panel)]" : "hover:bg-white/5",
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[11px] font-semibold">{vertical.name}</span>
                      <span className="tabular text-[11px] font-semibold">
                        {vertical.dataConfidence}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn("h-full rounded-full", confidenceBar(vertical.dataConfidence))}
                        style={{ width: `${vertical.dataConfidence}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-muted">
                      {vertical.openIssues} open · {vertical.criticalIssues} critical
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
              <div>
                <p className="tabular text-[18px] font-semibold">
                  {summary.detectedThisMonth}
                </p>
                <p className="text-[10px] text-muted">detected this month</p>
              </div>
              <div>
                <p className="tabular text-[18px] font-semibold">
                  {summary.closedThisMonth}
                </p>
                <p className="text-[10px] text-muted">certified this month</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-muted">
              Confidence is the share of records with no open exception. It rises only
              when an issue is revalidated.
            </p>
          </div>

          <div className="card p-5">
            <p className="eyebrow">People pulse</p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.02em]">
              HR under the same lens.
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="tabular text-[20px] font-semibold">
                  {summary.absence.toFixed(1)}%
                </p>
                <p className="text-[10px] text-muted">absence</p>
              </div>
              <div>
                <p className="tabular text-[20px] font-semibold">
                  {summary.overtime.toFixed(1)}%
                </p>
                <p className="text-[10px] text-muted">overtime</p>
              </div>
              <div>
                <p className="tabular text-[20px] font-semibold">
                  {compactKpiMoney(summary.costPerFte)}
                </p>
                <p className="text-[10px] text-muted">cost per FTE</p>
              </div>
              <div>
                <p className="tabular text-[20px] font-semibold">
                  {compactKpiMoney(summary.revenuePerFte)}
                </p>
                <p className="text-[10px] text-muted">revenue per FTE</p>
              </div>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                HR exception queue
              </p>
              <div className="mt-2 space-y-2">
                {hrIssues.slice(0, 3).map((issue) => (
                  <div
                    key={issue.id}
                    className="flex items-start justify-between gap-2 border-t border-line pt-2"
                  >
                    <div>
                      <p className="text-[11px] font-semibold leading-snug">{issue.title}</p>
                      <p className="mt-0.5 text-[10px] text-muted">
                        {getVertical(issue.vertical)?.name} · {issue.records} records
                      </p>
                    </div>
                    <Badge tone={severityTone(issue.severity)} className="whitespace-nowrap">
                      {issue.severity}
                    </Badge>
                  </div>
                ))}
                {hrIssues.length === 0 ? (
                  <p className="text-[10px] text-muted">No HR exceptions in this view.</p>
                ) : null}
              </div>
              <p className="mt-2 text-[11px]">
                <span className="font-semibold">{hrOpen}</span> HR exceptions open ·{" "}
                <span className={hrCritical > 0 ? "font-semibold text-bad" : "font-semibold"}>
                  {hrCritical} critical
                </span>
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-muted">
                People metrics use the same vertical and company code as the
                financials.
              </p>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-bad" />
              <p className="eyebrow">Director attention</p>
            </div>
            <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.02em]">
              Critical exceptions.
            </h2>
            <div className="mt-3 space-y-2">
              {criticalAttention.slice(0, 3).map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-lg border border-line bg-[var(--panel)] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12px] font-semibold leading-snug">{issue.title}</p>
                    <Badge tone="bad">Critical</Badge>
                  </div>
                  <p className="mt-1 text-[10px] text-muted">
                    {getVertical(issue.vertical)?.name} · {issue.records} records
                  </p>
                  <p className="mt-1 text-[11px] leading-snug">{issue.impact}</p>
                  <p className="mt-2 text-[10px] text-muted">
                    {issue.owner} · due {issue.due}
                  </p>
                </div>
              ))}
              {criticalAttention.length === 0 ? (
                <p className="text-[11px] text-muted">
                  No critical exceptions in this view.
                </p>
              ) : null}
            </div>
            {remainingCritical > 0 ? (
              <p className="mt-2 text-[10px] text-muted">
                +{remainingCritical} more critical {remainingCritical === 1 ? "issue" : "issues"}
              </p>
            ) : null}
            <a
              href="#exception-register"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-info"
            >
              Open exception register <ArrowRight className="h-3 w-3" />
            </a>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Data integrity loop</p>
            <h2 className="mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
              Detection → correction → certification.
            </h2>
          </div>
          <p className="text-[11px] text-muted">
            {summary.openIssues} open · {summary.criticalIssues} critical ·{" "}
            {summary.closedThisMonth} closed this month
          </p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {loop.map((stage) => (
            <div key={stage.label} className="card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                {stage.label}
              </p>
              <p className="tabular mt-1 text-[26px] font-semibold tracking-[-0.03em]">
                {stage.value}
              </p>
              <p className="mt-0.5 text-[10px] text-muted">{stage.hint}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-[82ch] text-[11px] leading-relaxed text-muted">
          The director view does not hide the exception. Each issue below carries the
          records, owner, status and remedy; the confidence score is only re-baselined
          after revalidation.
        </p>
      </section>

      <section id="exception-register" className="mt-10 scroll-mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Exception register</p>
            <h2 className="mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
              Every open byte has an owner.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
            <label className="flex items-center gap-1.5">
              Severity
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value as "all" | IssueSeverity)}
                className="rounded-md border border-line bg-surface px-2 py-1.5 text-[11px] font-medium text-ink outline-none"
              >
                <option value="all">All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </label>
            <span>
              {visibleIssues.length} of {scopeIssues.length} issues
            </span>
          </div>
        </div>

        <TableScroller
          label="Data exception register"
          className="mt-4 rounded-xl border border-line bg-surface"
        >
          <table className="w-full min-w-[1080px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-3 font-semibold">Issue</th>
                <th className="px-3 py-3 font-semibold">Vertical</th>
                <th className="px-3 py-3 font-semibold">Domain</th>
                <th className="px-3 py-3 font-semibold">Severity</th>
                <th className="px-3 py-3 text-right font-semibold">Records</th>
                <th className="px-3 py-3 font-semibold">Owner</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Due</th>
                <th className="px-4 py-3 font-semibold">Remedy</th>
              </tr>
            </thead>
            <tbody>
              {!hasIssues ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-[11px] text-muted">
                    No issues match this view.
                  </td>
                </tr>
              ) : null}
              {visibleIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className={cn(
                    "border-b border-line/70 last:border-0",
                    issue.status === "Rectified" && "opacity-60",
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold">{issue.title}</p>
                    <p className="mt-0.5 text-[10px] text-muted">{issue.impact}</p>
                  </td>
                  <td className="px-3 py-3 text-muted">
                    {getVertical(issue.vertical)?.name}
                  </td>
                  <td className="px-3 py-3 text-muted">{issue.domain}</td>
                  <td className="px-3 py-3">
                    <Badge tone={severityTone(issue.severity)}>{issue.severity}</Badge>
                  </td>
                  <td className="px-3 py-3 text-right tabular font-semibold">
                    {formatNumber(issue.records)}
                  </td>
                  <td className="px-3 py-3 text-muted">{issue.owner}</td>
                  <td className="px-3 py-3">
                    <Badge tone={statusTone(issue.status)} className="whitespace-nowrap">
                      {issue.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted">{issue.due}</td>
                  <td className="px-4 py-3 text-muted">{issue.remedy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroller>
        <p className="mt-2 text-[10px] text-muted">
          The register shows the current open issues plus the latest certified example.
          {` ${summary.closedThisMonth} issues were certified this month.`}
        </p>
      </section>

      <section className="mt-10 rounded-xl border border-line bg-[var(--panel-strong)] px-5 py-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Nirmana ERP · sibling portfolios
            </p>
            <p className="mt-1 text-[15px] font-semibold">Separate business domains.</p>
            <p className="mt-1 max-w-[62ch] text-[12px] leading-relaxed text-white/65">
              Sibling portfolios are separate Nirmana ERP business domains with their
              own users. Pramaan currently opens its audit pack inside Gearbox; Kavach
              is planned. The rest leave this dashboard.
            </p>
            <Link
              href="/portfolio"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--warn)]"
            >
              Portfolio overview <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {PORTFOLIO.map((item) => {
              const body = (
                <>
                  <span className="flex items-center justify-between gap-3">
                    {item.name}
                    {item.external ? (
                      <ArrowUpRight className="h-3 w-3 text-white/45" />
                    ) : (
                      <ArrowRight className="h-3 w-3 text-white/45" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-normal text-white/45">
                    {item.domain}
                    {item.external && !item.planned ? "" : " · planned"}
                  </span>
                </>
              );

              if (item.planned) {
                return (
                  <div
                    key={item.name}
                    className="rounded-md border border-white/10 px-3 py-2 text-[11px] font-semibold text-white/55"
                  >
                    {body}
                  </div>
                );
              }

              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="rounded-md border border-white/15 px-3 py-2 text-[11px] font-semibold text-white/85 transition-colors hover:bg-white/5"
                >
                  {body}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-md border border-white/15 px-3 py-2 text-[11px] font-semibold text-white/85 transition-colors hover:bg-white/5"
                >
                  {body}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
