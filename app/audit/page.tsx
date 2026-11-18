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
      <div className="border-b border-line bg-[var(--panel-strong)] px-5 py-2 text-center text-[11px] text-white/60">
        Pramaan is a separate Nirmana ERP portfolio. This audit pack is a temporary
        preview inside Gearbox; the dedicated Pramaan subdomain is in preparation.
      </div>
      <AuditWorkspace />
    </main>
  );
}
