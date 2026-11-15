import type { Metadata } from "next";
import { SimpleHeader } from "@/components/simple-header";
import { AuditWorkspace } from "@/components/audit/audit-workspace";

export const metadata: Metadata = {
  title: "SAP PM audit · Gearbox demo",
  description:
    "A 20-check SAP PM audit across master data and transactional tables: readiness, evidence, findings and remediation.",
};

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <SimpleHeader />
      <AuditWorkspace />
    </main>
  );
}
