import type { Metadata } from "next";
import { SimpleHeader } from "@/components/simple-header";
import { EnterpriseDashboard } from "@/components/enterprise/enterprise-dashboard";

export const metadata: Metadata = {
  title: "Enterprise command · Meridian Energy · Gearbox",
  description:
    "Directors' command view across Meridian Energy's Generation, Grid, Services and Retail verticals: revenue, cost, people, data confidence and the closed-loop exception register.",
};

export default function EnterprisePage() {
  return (
    <main className="min-h-screen bg-canvas">
      <SimpleHeader />
      <EnterpriseDashboard />
    </main>
  );
}
