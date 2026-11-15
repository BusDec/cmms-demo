import {
  AUDIT_CHECKS,
  AUDIT_DATE,
  DOMAINS,
  FRAMEWORK_VERSION,
  OWNER_BY_DOMAIN,
  SEVERITY_WEIGHT,
  SLA_DAYS,
} from "./framework";
import type {
  AuditCheck,
  AuditDataset,
  AuditRun,
  CheckResult,
  CheckStatus,
  DomainResult,
  EntityKey,
  EvidenceRow,
  Finding,
  Opinion,
  RawOutcome,
  RowLike,
  RuleSpec,
} from "./types";

const DAY = 86_400_000;

function blank(value: unknown) {
  return value === null || value === undefined || value === "";
}

function rowsFor(dataset: AuditDataset, entity: EntityKey): RowLike[] {
  return dataset[entity] as unknown as RowLike[];
}

function daysBetween(from: string, to: string) {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.round((end - start) / DAY);
}

export function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY)
    .toISOString()
    .slice(0, 10);
}

function evaluateRule(rule: RuleSpec, dataset: AuditDataset, auditDate: string): RawOutcome {
  switch (rule.kind) {
    case "missing": {
      const rows = rowsFor(dataset, rule.entity).filter(rule.where ?? (() => true));
      const bad = rows.filter((row) => rule.fields.some((field) => blank(row[field])));
      return { total: rows.length, exceptions: bad.length, sample: bad.slice(0, 5) };
    }
    case "orphan": {
      const rows = rowsFor(dataset, rule.entity).filter(rule.where ?? (() => true));
      const parents = new Set(
        rowsFor(dataset, rule.parent)
          .filter(rule.parentWhere ?? (() => true))
          .map((row) => String(row[rule.parentField] ?? "")),
      );
      const bad = rows.filter((row) => {
        const value = String(row[rule.field] ?? "");
        return blank(value) || !parents.has(value);
      });
      return { total: rows.length, exceptions: bad.length, sample: bad.slice(0, 5) };
    }
    case "status": {
      const rows = rowsFor(dataset, rule.entity).filter(rule.where ?? (() => true));
      const bad = rows.filter(
        (row) => !rule.allowed.includes(String(row[rule.field] ?? "")),
      );
      return { total: rows.length, exceptions: bad.length, sample: bad.slice(0, 5) };
    }
    case "zero": {
      const rows = rowsFor(dataset, rule.entity).filter(rule.where ?? (() => true));
      const bad = rows.filter((row) => Number(row[rule.field] ?? 0) === 0);
      return { total: rows.length, exceptions: bad.length, sample: bad.slice(0, 5) };
    }
    case "aging": {
      const rows = rowsFor(dataset, rule.entity).filter(rule.where ?? (() => true));
      const bad = rows.filter((row) => {
        const value = String(row[rule.dateField] ?? "");
        if (!value) return false;
        return daysBetween(value, auditDate) > rule.olderThanDays;
      });
      return { total: rows.length, exceptions: bad.length, sample: bad.slice(0, 5) };
    }
    case "custom": {
      return rule.run({ dataset, auditDate, plant: "1000" });
    }
    default:
      return { total: 0, exceptions: 0, sample: [] };
  }
}

function toEvidence(row: RowLike, fields: string[]): EvidenceRow {
  const evidence: EvidenceRow = {};
  for (const field of fields) {
    const value = row[field];
    evidence[field] = blank(value) ? "—" : (value as string | number | boolean);
  }
  return evidence;
}

function opinionFor(readiness: number, criticals: number): Opinion {
  if (readiness >= 85 && criticals === 0) return "Green";
  if (readiness >= 70 && criticals <= 2) return "Amber";
  return "Red";
}

export function runAudit(
  dataset: AuditDataset,
  auditDate: string = AUDIT_DATE,
  checks: AuditCheck[] = AUDIT_CHECKS.filter((check) => check.enabled),
): AuditRun {
  const results: CheckResult[] = checks.map((check) => {
    if (!check.rule) {
      return {
        check,
        total: 0,
        exceptions: 0,
        exceptionPct: 0,
        status: "na" as CheckStatus,
        sample: [],
      };
    }

    const outcome = evaluateRule(check.rule, dataset, auditDate);
    const exceptionPct =
      outcome.total === 0 ? 0 : (outcome.exceptions / outcome.total) * 100;
    const status: CheckStatus =
      outcome.total === 0
        ? "na"
        : exceptionPct <= check.maxExceptionPct
          ? "pass"
          : "fail";

    return {
      check,
      total: outcome.total,
      exceptions: outcome.exceptions,
      exceptionPct,
      status,
      sample: outcome.sample.map((row) => toEvidence(row, check.evidence)),
    };
  });

  const domains: DomainResult[] = DOMAINS.map((domain) => {
    const domainResults = results.filter((result) => result.check.domain === domain.id);
    const evaluated = domainResults.filter((result) => result.status !== "na").length;
    const passed = domainResults.filter((result) => result.status === "pass").length;
    const failed = domainResults.filter((result) => result.status === "fail").length;
    const na = domainResults.filter((result) => result.status === "na").length;
    const criticalFailures = domainResults.filter(
      (result) => result.status === "fail" && result.check.severity === "Critical",
    ).length;
    const readiness = evaluated === 0 ? 0 : Math.round((passed / evaluated) * 100);

    return {
      domain,
      checks: domainResults.length,
      evaluated,
      passed,
      failed,
      na,
      criticalFailures,
      readiness,
      opinion: evaluated === 0 ? "Red" : opinionFor(readiness, criticalFailures),
    };
  }).filter((domain) => domain.checks > 0);

  const evaluated = results.filter((result) => result.status !== "na");
  const passed = evaluated.filter((result) => result.status === "pass").length;
  const failed = evaluated.filter((result) => result.status === "fail").length;
  const criticalFailures = evaluated.filter(
    (result) => result.status === "fail" && result.check.severity === "Critical",
  ).length;
  const readiness = evaluated.length === 0 ? 0 : Math.round((passed / evaluated.length) * 100);

  const weightedFailures = evaluated
    .filter((result) => result.status === "fail")
    .reduce((sum, result) => sum + SEVERITY_WEIGHT[result.check.severity], 0);
  const weightedTotal = evaluated.reduce(
    (sum, result) => sum + SEVERITY_WEIGHT[result.check.severity],
    0,
  );
  const riskIndex = weightedTotal === 0 ? 0 : Math.round((weightedFailures / weightedTotal) * 100);

  const findings: Finding[] = evaluated
    .filter((result) => result.status === "fail")
    .map((result): Finding => {
      const domain = DOMAINS.find((item) => item.id === result.check.domain);
      return {
        id: `F-${result.check.id}`,
        checkId: result.check.id,
        domain: result.check.domain,
        domainName: domain?.name ?? result.check.domain,
        title: result.check.title,
        severity: result.check.severity,
        total: result.total,
        exceptions: result.exceptions,
        exceptionPct: result.exceptionPct,
        benchmark: result.check.benchmark,
        remediation: result.check.remediation,
        owner: OWNER_BY_DOMAIN[result.check.domain],
        due: addDays(auditDate, SLA_DAYS[result.check.severity]),
        status: "Open",
      };
    })
    .sort((a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]);

  return {
    frameworkVersion: FRAMEWORK_VERSION,
    auditDate,
    results,
    domains,
    findings,
    overall: {
      checks: results.length,
      evaluated: evaluated.length,
      passed,
      failed,
      na: results.filter((result) => result.status === "na").length,
      criticalFailures,
      readiness,
      riskIndex,
      opinion: opinionFor(readiness, criticalFailures),
      redDomains: domains.filter((domain) => domain.opinion === "Red").length,
      greenDomains: domains.filter((domain) => domain.opinion === "Green").length,
    },
  };
}

export function statusLabel(result: CheckResult) {
  if (result.status === "na") return "N/A";
  return result.status === "pass" ? "Pass" : "Fail";
}
