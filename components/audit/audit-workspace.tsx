"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/badge";
import { ChartCard } from "@/components/chart-card";
import { EChart } from "@/components/e-chart";
import { StatCard } from "@/components/kpi-card";
import { TableScroller } from "@/components/table-scroller";
import {
  AUDIT_CHECKS,
  AUDIT_CONTEXT,
  AUDIT_DATE,
  DOMAINS,
  FRAMEWORK_NOTES,
  FRAMEWORK_VERSION,
} from "@/lib/audit/framework";
import { DEFINITIONS, SCORE_RULES } from "@/lib/audit/definitions";
import { runAudit, statusLabel } from "@/lib/audit/engine";
import { buildSyntheticDataset } from "@/lib/audit/synthetic";
import type {
  CheckResult,
  CheckStatus,
  DomainId,
  EvidenceRow,
  Finding,
  Opinion,
  Severity,
} from "@/lib/audit/types";

type Tab = "checks" | "findings";

const opinionTone: Record<Opinion, "good" | "warn" | "bad"> = {
  Green: "good",
  Amber: "warn",
  Red: "bad",
};

const opinionColor: Record<Opinion, string> = {
  Green: "#4fd1c5",
  Amber: "#e8a33d",
  Red: "#f97066",
};

const statusTone: Record<CheckStatus, "good" | "bad" | "neutral"> = {
  pass: "good",
  fail: "bad",
  na: "neutral",
};

const severityTone: Record<Severity, "bad" | "warn" | "neutral"> = {
  Critical: "bad",
  High: "warn",
  Medium: "neutral",
};

const tooltip = {
  backgroundColor: "#0d2638",
  borderWidth: 1,
  borderColor: "rgba(234,242,246,0.14)",
  textStyle: { color: "#eaf2f6", fontSize: 12 },
  padding: [8, 10],
};

const axisLabel = { color: "#8fa9b7", fontSize: 10 };

function domainName(id: DomainId) {
  return DOMAINS.find((domain) => domain.id === id)?.name ?? id;
}

function formatCell(value: string | number | boolean | undefined) {
  if (value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === "") return "—";
  return String(value);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || !MONTHS[index]) return value;
  return `${day} ${MONTHS[index]} ${year}`;
}

function formatPct(value: number) {
  if (value === 0) return "0%";
  return `${value.toFixed(value < 10 ? 1 : 0)}%`;
}

export function AuditWorkspace() {
  const run = useMemo(() => runAudit(buildSyntheticDataset()), []);
  const [tab, setTab] = useState<Tab>("checks");
  const [domainFilter, setDomainFilter] = useState<DomainId | "all">("all");
  const [selected, setSelected] = useState<CheckResult | null>(null);

  const resultByCheck = useMemo(
    () => new Map(run.results.map((result) => [result.check.id, result])),
    [run.results],
  );

  const visibleResults = useMemo(
    () =>
      run.results.filter(
        (result) => domainFilter === "all" || result.check.domain === domainFilter,
      ),
    [run.results, domainFilter],
  );

  const visibleFindings = useMemo(
    () =>
      run.findings.filter(
        (finding) => domainFilter === "all" || finding.domain === domainFilter,
      ),
    [run.findings, domainFilter],
  );

  const severityCounts = useMemo(() => {
    const counts: Record<Severity, number> = { Critical: 0, High: 0, Medium: 0 };
    for (const finding of run.findings) counts[finding.severity] += 1;
    return counts;
  }, [run.findings]);

  const domainOption = useMemo(() => {
    const sorted = [...run.domains].sort((a, b) => a.readiness - b.readiness);
    return {
      grid: { left: 4, right: 46, top: 8, bottom: 4, containLabel: true },
      tooltip: { ...tooltip, trigger: "axis" },
      xAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { ...axisLabel, formatter: "{value}%" },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "rgba(234,242,246,0.08)" } },
      },
      yAxis: {
        type: "category",
        data: sorted.map((domain) => domain.domain.name),
        inverse: true,
        axisLabel: { color: "#c7d5df", fontSize: 10 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: "bar",
          barMaxWidth: 12,
          data: sorted.map((domain) => ({
            value: domain.readiness,
            itemStyle: {
              color: opinionColor[domain.opinion],
              borderRadius: [0, 3, 3, 0],
            },
          })),
          label: {
            show: true,
            position: "right",
            formatter: "{c}%",
            color: "#8fa9b7",
            fontSize: 10,
          },
        },
      ],
    };
  }, [run.domains]);

  function exportFindings() {
    const header = [
      "Finding",
      "Check",
      "Domain",
      "Severity",
      "Exceptions",
      "Total",
      "Exception %",
      "Benchmark",
      "Owner",
      "Due",
      "T-code",
      "SPRO",
      "BAPI",
      "Action",
    ];
    const rows = run.findings.map((finding) => [
      finding.id,
      finding.checkId,
      finding.domainName,
      finding.severity,
      finding.exceptions,
      finding.total,
      finding.exceptionPct.toFixed(1),
      finding.benchmark,
      finding.owner,
      finding.due,
      finding.remediation.tcode,
      finding.remediation.spro ?? "",
      finding.remediation.bapi ?? "",
      finding.remediation.action,
    ]);
    const escape = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;
    const csv = [header, ...rows]
      .map((row) => row.map(escape).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sap-pm-audit-${AUDIT_DATE}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const overall = run.overall;
  const opinionCopy =
    overall.opinion === "Green"
      ? "Controls are operating. Keep the checks running monthly so the score stays honest."
      : overall.opinion === "Amber"
        ? "Material gaps exist but none is beyond recovery. Fix the critical records first; the percentage follows."
        : "The implementation is not audit-ready. Treat the critical findings as a stop signal, not a backlog item.";

  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-14 pt-8 sm:px-8 lg:pt-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">SAP PM audit</p>
            <Badge tone="neutral">Synthetic dataset</Badge>
          </div>
          <h1 className="mt-2 max-w-[20ch] text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Audit the PM module, not the dashboard.
          </h1>
          <p className="measure mt-3 text-[14px] leading-relaxed text-muted">
            Twenty checks across thirteen SAP PM domains, computed from the rows a
            planner would inspect. Every score opens to the records behind it, the
            benchmark it breached and the transaction that fixes it.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportFindings}
            className="inline-flex items-center gap-2 rounded-md border border-line-strong px-3.5 py-2 text-[12px] font-semibold text-ink transition-colors hover:bg-white/5"
          >
            <Download className="h-4 w-4" />
            Export findings
          </button>
          <a
            href="#method"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--warn)] px-3.5 py-2 text-[12px] font-semibold text-[var(--graphite)] transition-colors hover:bg-[#f0b95f]"
          >
            How it scores <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["System / client", `${AUDIT_CONTEXT.system} · ${AUDIT_CONTEXT.client}`],
          ["Plant", `${AUDIT_CONTEXT.plant} · ${AUDIT_CONTEXT.plantName}`],
          ["Audit date", AUDIT_DATE],
          ["Lead", AUDIT_CONTEXT.lead],
          ["Framework", `v${FRAMEWORK_VERSION} · 20 of ${AUDIT_CHECKS.length} checks`],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              {label}
            </p>
            <p className="mt-1 text-[12px] font-semibold leading-snug">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 xl:grid-cols-5">
        <StatCard
          label="Overall readiness"
          value={`${overall.readiness}%`}
          hint={`${overall.passed} of ${overall.evaluated} evaluated checks pass`}
          tone={overall.readiness >= 85 ? "good" : overall.readiness >= 70 ? "warn" : "bad"}
        />
        <StatCard
          label="Audit opinion"
          value={overall.opinion}
          hint={`${overall.criticalFailures} critical ${overall.criticalFailures === 1 ? "gap" : "gaps"} · ${overall.redDomains} of ${run.domains.length} domains red`}
          tone={opinionTone[overall.opinion]}
        />
        <StatCard
          label="Open findings"
          value={String(run.findings.length)}
          hint="Each with an owner, a due date and a remedy"
          tone={run.findings.length > 0 ? "warn" : "good"}
        />
        <StatCard
          label="Risk index"
          value={String(overall.riskIndex)}
          hint="Severity-weighted. Zero is clean; 100 is everything failed"
          tone={overall.riskIndex <= 20 ? "good" : overall.riskIndex <= 40 ? "warn" : "bad"}
        />
        <StatCard
          label="Check coverage"
          value={`${overall.evaluated}/${AUDIT_CHECKS.length}`}
          hint={`${overall.na} N/A · v1 of the 50-check catalog`}
          tone="info"
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <ChartCard
          title="Domain readiness"
          subtitle="Sorted by the weakest domain. Colour follows the audit opinion, not the percentage alone."
        >
          <EChart
            option={domainOption}
            height={370}
            ariaLabel="Horizontal bar chart of readiness by SAP PM domain"
          />
        </ChartCard>

        <div className="grid gap-3">
          <section className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Audit opinion
                </p>
                <p
                  className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.03em]"
                  style={{ color: opinionColor[overall.opinion] }}
                >
                  {overall.opinion}
                </p>
              </div>
              <span
                className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: `${opinionColor[overall.opinion]}1f` }}
              >
                {overall.opinion === "Green" ? (
                  <ShieldCheck className="h-5 w-5" style={{ color: opinionColor[overall.opinion] }} />
                ) : (
                  <AlertTriangle className="h-5 w-5" style={{ color: opinionColor[overall.opinion] }} />
                )}
              </span>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-muted">{opinionCopy}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={overall.criticalFailures > 0 ? "bad" : "good"}>
                {overall.criticalFailures} critical
              </Badge>
              <Badge tone="neutral">{overall.greenDomains} green domains</Badge>
              <Badge tone="neutral">{overall.evaluated} evaluated</Badge>
            </div>
          </section>

          <section className="card p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Findings by severity
            </p>
            <div className="mt-3 space-y-2.5">
              {(["Critical", "High", "Medium"] as Severity[]).map((severity) => {
                const count = severityCounts[severity];
                const share = run.findings.length === 0 ? 0 : (count / run.findings.length) * 100;
                return (
                  <div key={severity}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold">{severity}</span>
                      <span className="tabular text-muted">{count}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${share}%`,
                          background:
                            severity === "Critical"
                              ? "#f97066"
                              : severity === "High"
                                ? "#e8a33d"
                                : "#8fa9b7",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] leading-snug text-muted">
              A domain can be highly compliant and still carry a critical gap. The
              opinion counts critical failures separately; a high percentage never
              clears them.
            </p>
          </section>
        </div>
      </div>

      <section className="mt-3 card overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-3 px-4 pt-4">
          <div>
            <h2 className="text-[14px] font-semibold tracking-[-0.01em]">Domain scorecard</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Master data and transactional health, by audit domain.
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
            {run.domains.length} domains · {overall.checks} checks
          </p>
        </div>
        <TableScroller label="Domain scorecard" className="mt-2">
          <table className="w-full min-w-[720px] text-left text-[12px]">
            <thead>
              <tr className="border-y border-line text-[10px] uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-2 font-semibold">Domain</th>
                <th className="px-3 py-2 font-semibold">Section</th>
                <th className="px-3 py-2 text-right font-semibold">Checks</th>
                <th className="px-3 py-2 text-right font-semibold">Pass</th>
                <th className="px-3 py-2 text-right font-semibold">Fail</th>
                <th className="px-3 py-2 text-right font-semibold">Readiness</th>
                <th className="px-3 py-2 font-semibold">Opinion</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {run.domains.map((domain) => (
                <tr key={domain.domain.id} className="border-b border-line/70 last:border-0">
                  <td className="px-4 py-2.5 font-semibold">{domain.domain.name}</td>
                  <td className="px-3 py-2.5 text-muted">{domain.domain.section}</td>
                  <td className="px-3 py-2.5 text-right tabular text-muted">{domain.checks}</td>
                  <td className="px-3 py-2.5 text-right tabular text-good">{domain.passed}</td>
                  <td className="px-3 py-2.5 text-right tabular text-bad">{domain.failed}</td>
                  <td className="px-3 py-2.5 text-right tabular font-semibold">{domain.readiness}%</td>
                  <td className="px-3 py-2.5">
                    <Badge tone={opinionTone[domain.opinion]}>{domain.opinion}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setDomainFilter(domain.domain.id);
                        setTab("checks");
                      }}
                      className="text-[11px] font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroller>
      </section>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-2">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Audit views">
          {(
            [
              ["checks", `Checks (${run.results.length})`],
              ["findings", `Findings (${run.findings.length})`],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                tab === key ? "bg-white/10 text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-[11px] text-muted">
          Domain
          <select
            value={domainFilter}
            onChange={(event) => setDomainFilter(event.target.value as DomainId | "all")}
            className="rounded-md border border-line bg-surface px-2 py-1.5 text-[12px] font-medium text-ink outline-none"
          >
            <option value="all">All domains</option>
            {DOMAINS.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.id} · {domain.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {tab === "checks" ? (
        <section className="card mt-3 overflow-hidden">
          <TableScroller label="Audit checks">
            <table className="w-full min-w-[900px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-2.5 font-semibold">Check</th>
                  <th className="px-3 py-2.5 font-semibold">Domain</th>
                  <th className="px-3 py-2.5 font-semibold">Severity</th>
                  <th className="px-3 py-2.5 font-semibold">Result</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Exceptions</th>
                  <th className="px-3 py-2.5 font-semibold">Benchmark</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {visibleResults.map((result) => (
                  <tr key={result.check.id} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-2.5">
                      <span className="font-semibold">{result.check.id}</span>
                      <span className="ml-2 text-muted">{result.check.title}</span>
                    </td>
                    <td className="px-3 py-2.5 text-muted">{domainName(result.check.domain)}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={severityTone[result.check.severity]}>
                        {result.check.severity}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone={statusTone[result.status]}>{statusLabel(result)}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular">
                      <span className="font-semibold">{result.exceptions}</span>
                      <span className="text-muted">/{result.total}</span>
                      <span className="ml-1 text-[10px] text-muted">
                        {formatPct(result.exceptionPct)}
                      </span>
                    </td>
                    <td className="max-w-[300px] px-3 py-2.5 text-[11px] text-muted">
                      {result.check.benchmark}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(result)}
                        aria-label={`Open ${result.check.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted hover:bg-white/5 hover:text-ink"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroller>
        </section>
      ) : (
        <section className="card mt-3 overflow-hidden">
          <TableScroller label="Audit findings">
            <table className="w-full min-w-[980px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-2.5 font-semibold">Finding</th>
                  <th className="px-3 py-2.5 font-semibold">Domain</th>
                  <th className="px-3 py-2.5 font-semibold">Severity</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Exceptions</th>
                  <th className="px-3 py-2.5 font-semibold">Owner</th>
                  <th className="px-3 py-2.5 font-semibold">Due</th>
                  <th className="px-3 py-2.5 font-semibold">Remedy</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {visibleFindings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-[11px] text-muted">
                      No findings for this domain.
                    </td>
                  </tr>
                ) : null}
                {visibleFindings.map((finding) => (
                  <tr key={finding.id} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-2.5">
                      <span className="font-semibold">{finding.id}</span>
                      <span className="ml-2 text-muted">{finding.title}</span>
                    </td>
                    <td className="px-3 py-2.5 text-muted">{finding.domainName}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={severityTone[finding.severity]}>{finding.severity}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular">
                      <span className="font-semibold">{finding.exceptions}</span>
                      <span className="text-muted">/{finding.total}</span>
                    </td>
                    <td className="px-3 py-2.5 text-muted">{finding.owner}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular text-muted">{formatDate(finding.due)}</td>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold">{finding.remediation.tcode}</span>
                      <span className="ml-2 text-[11px] text-muted">
                        {finding.remediation.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const result = resultByCheck.get(finding.checkId);
                          if (result) setSelected(result);
                        }}
                        aria-label={`Open ${finding.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted hover:bg-white/5 hover:text-ink"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroller>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-[10px] text-muted">
            <span>
              Due dates follow severity: Critical 14 days, High 30, Medium 60.
            </span>
            <button
              type="button"
              onClick={exportFindings}
              className="inline-flex items-center gap-1.5 font-semibold text-muted hover:text-ink"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </button>
          </div>
        </section>
      )}

      <div id="method" className="mt-8 scroll-mt-20">
        <p className="eyebrow">Method</p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">
          What the number means
        </h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {SCORE_RULES.map((rule) => (
            <div key={rule.title} className="card p-4">
              <p className="text-[12px] font-semibold">{rule.title}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{rule.detail}</p>
            </div>
          ))}
        </div>

        <details className="group card mt-3 overflow-hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <div>
              <span className="text-[12px] font-semibold">The other 30 checks</span>
              <span className="ml-2 text-[11px] text-muted">
                Catalogued, not evaluated in this run
              </span>
            </div>
            <span className="flex shrink-0 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
              <span className="group-open:hidden">Open</span>
              <span className="hidden group-open:inline">Close</span>
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <div className="border-t border-line">
            <TableScroller label="Planned audit checks">
              <table className="w-full min-w-[760px] text-left text-[11px]">
                <thead>
                  <tr className="border-b border-line text-[9px] uppercase tracking-[0.08em] text-muted">
                    <th className="px-4 py-2 font-semibold">Check</th>
                    <th className="px-3 py-2 font-semibold">Title</th>
                    <th className="px-3 py-2 font-semibold">Domain</th>
                    <th className="px-3 py-2 font-semibold">Severity</th>
                    <th className="px-3 py-2 font-semibold">Benchmark</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_CHECKS.filter((check) => !check.enabled).map((check) => (
                    <tr key={check.id} className="border-b border-line/70 last:border-0">
                      <td className="px-4 py-2 font-semibold">{check.id}</td>
                      <td className="px-3 py-2">{check.title}</td>
                      <td className="px-3 py-2 text-muted">{domainName(check.domain)}</td>
                      <td className="px-3 py-2">
                        <Badge tone={severityTone[check.severity]}>{check.severity}</Badge>
                      </td>
                      <td className="px-3 py-2 text-muted">{check.benchmark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroller>
          </div>
        </details>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="card overflow-hidden">
            <div className="px-4 pt-4">
              <h3 className="text-[14px] font-semibold">Definitions</h3>
              <p className="mt-0.5 text-[11px] text-muted">
                The words that decide which rows enter a check.
              </p>
            </div>
            <dl className="mt-2 divide-y divide-line/70">
              {DEFINITIONS.map((definition) => (
                <div key={definition.term} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[150px_1fr] sm:gap-4">
                  <dt className="text-[11px] font-semibold">{definition.term}</dt>
                  <dd className="text-[11px] leading-relaxed text-muted">{definition.detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card p-4">
            <h3 className="text-[14px] font-semibold">Scope and sources</h3>
            <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-muted">
              {FRAMEWORK_NOTES.map((note) => (
                <li key={note} className="border-t border-line pt-2 first:border-0 first:pt-0">
                  {note}
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-md border border-line bg-[rgba(232,163,61,0.06)] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-warn">
                What is real here
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                The rule engine, the scoring and the evidence drill are real. The
                rows are a deterministic demonstration dataset for a combined-cycle
                plant. No SAP system is called, and this is not an SAP-certified
                audit.
              </p>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-muted">
              The next step is an import of SE16N extracts; the same engine runs on
              those tables without a server round trip.
            </p>
          </section>
        </div>
      </div>

      {selected ? (
        <CheckDrawer
          result={selected}
          finding={run.findings.find((finding) => finding.checkId === selected.check.id)}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}

function CheckDrawer({
  result,
  finding,
  onClose,
}: {
  result: CheckResult;
  finding?: Finding;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const fields = result.check.evidence;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${result.check.id} ${result.check.title}`}
        className="h-full w-full max-w-[620px] overflow-y-auto border-l border-line bg-surface p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-warn">
              {result.check.id} · {domainName(result.check.domain)}
            </p>
            <h2 className="mt-1 text-[19px] font-semibold leading-tight tracking-[-0.02em]">
              {result.check.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line text-muted hover:bg-white/5 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone={statusTone[result.status]}>{statusLabel(result)}</Badge>
          <Badge tone={severityTone[result.check.severity]}>{result.check.severity}</Badge>
          <Badge tone="neutral">{result.check.tables.join(" · ")}</Badge>
          {finding ? <Badge tone="warn">Due {formatDate(finding.due)}</Badge> : null}
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-muted">{result.check.question}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["Records", String(result.total)],
            ["Exceptions", String(result.exceptions)],
            ["Exception %", formatPct(result.exceptionPct)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-line bg-[rgba(234,242,246,0.03)] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">
                {label}
              </p>
              <p className="mt-1 text-[18px] font-semibold tabular">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-line p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
            Rule
          </p>
          <p className="mt-1 text-[12px] leading-relaxed">{result.check.ruleSummary}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Benchmark: {result.check.benchmark}. Threshold: {result.check.maxExceptionPct}% of
            the evaluated population.
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-end justify-between gap-2">
            <h3 className="text-[12px] font-semibold">Evidence sample</h3>
            <span className="text-[10px] text-muted">
              {result.sample.length} of {result.exceptions} exceptions
            </span>
          </div>
          {result.sample.length > 0 ? (
            <div className="mt-2 overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[420px] text-left text-[11px]">
                <thead>
                  <tr className="border-b border-line bg-[rgba(234,242,246,0.04)] text-[9px] uppercase tracking-[0.08em] text-muted">
                    {fields.map((field) => (
                      <th key={field} className="px-2.5 py-2 font-semibold">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.sample.map((row: EvidenceRow, index) => (
                    <tr key={index} className="border-b border-line/60 last:border-0">
                      {fields.map((field) => (
                        <td key={field} className="px-2.5 py-2 tabular">
                          {formatCell(row[field])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 rounded-md border border-line p-3 text-[11px] text-muted">
              No failing records to show. This check is within threshold.
            </p>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-[12px] font-semibold">Remediation</h3>
          <dl className="mt-2 grid grid-cols-[86px_1fr] gap-y-2 text-[12px]">
            <dt className="text-muted">T-code</dt>
            <dd className="font-semibold">{result.check.remediation.tcode}</dd>
            {result.check.remediation.spro ? (
              <>
                <dt className="text-muted">SPRO</dt>
                <dd>{result.check.remediation.spro}</dd>
              </>
            ) : null}
            {result.check.remediation.bapi ? (
              <>
                <dt className="text-muted">BAPI</dt>
                <dd className="font-mono text-[11px]">{result.check.remediation.bapi}</dd>
              </>
            ) : null}
            <dt className="text-muted">Action</dt>
            <dd className="leading-relaxed">{result.check.remediation.action}</dd>
            {finding ? (
              <>
                <dt className="text-muted">Owner</dt>
                <dd>{finding.owner}</dd>
              </>
            ) : null}
          </dl>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-md border border-line bg-[rgba(234,242,246,0.03)] p-3 text-[10px] leading-relaxed text-muted">
          {result.status === "fail" ? (
            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bad" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-good" />
          )}
          <span>
            Source: {result.check.source}. Audit date {AUDIT_DATE}. Population filtered to
            plant {AUDIT_CONTEXT.plant}.
          </span>
        </div>
      </div>
    </div>
  );
}
