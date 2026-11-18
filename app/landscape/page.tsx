import type { Metadata } from "next";
import { SimpleHeader } from "@/components/simple-header";
import { LandscapeDashboard } from "@/components/landscape/landscape-dashboard";

export const metadata: Metadata = {
  title: "SAP landscape · Gearbox by Nirmana",
  description:
    "SAP enterprise structure across S/4HANA and ECC R/3: company codes, plants, business areas, controlling areas and organisational units.",
};

export default function LandscapePage() {
  return (
    <main className="min-h-screen bg-canvas">
      <SimpleHeader />
      <LandscapeDashboard />
    </main>
  );
}
