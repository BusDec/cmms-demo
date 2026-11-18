import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gearbox · nirmNa SAP landscape intelligence",
  description:
    "Gearbox reads the SAP enterprise structure across S/4HANA and ECC R/3 — company codes, plants, business areas and controlling areas — with a four-plant maintenance command centre on top.",
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
