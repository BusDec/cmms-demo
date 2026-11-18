import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gearbox · Nirmana integrated ERP dashboards",
  description:
    "Integrated dashboards across ERP practices and business processes: enterprise command, SAP landscape and maintenance, with data confidence and a closed-loop exception register.",
};

export const viewport: Viewport = {
  themeColor: "#071a28",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
