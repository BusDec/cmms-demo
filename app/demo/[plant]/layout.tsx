import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getPlant, plants } from "@/lib/plants";

export function generateStaticParams() {
  return plants.map((plant) => ({ plant: plant.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ plant: string }>;
}) {
  const { plant: slug } = await params;
  const plant = getPlant(slug);
  return {
    title: plant ? `${plant.name} · Nirmana demo` : "Nirmana demo",
    description: plant?.story,
  };
}

export default async function PlantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ plant: string }>;
}) {
  const { plant: slug } = await params;
  const plant = getPlant(slug);
  if (!plant) notFound();

  return <AppShell plant={plant}>{children}</AppShell>;
}
