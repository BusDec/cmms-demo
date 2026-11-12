import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gearbox — Four plants. Four ERPs. One maintenance intelligence layer.",
  description:
    "A synthetic four-plant CMMS demo showing one canonical maintenance model over SAP S/4HANA, SAP ECC, IBM Maximo and Oracle EAM.",
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
