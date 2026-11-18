import type { Metadata } from "next";
import { SimpleHeader } from "@/components/simple-header";
import { AuditWorkspace } from "@/components/audit/audit-workspace";

export const metadata: Metadata = {
  title: "Pramaan ERP audit · SAP PM pack",
  description:
    "Pramaan ERP audit: a 20-check SAP PM pack across master data and transactional tables, with readiness, evidence, findings and remediation.",
};

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <SimpleHeader product="Pramaan" />
      <AuditWorkspace />
    </main>
  );
}
