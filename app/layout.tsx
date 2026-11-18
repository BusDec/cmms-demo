import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gearbox · nirmNa enterprise command",
  description:
    "Gearbox gives Meridian Energy directors one enterprise view across Generation, Grid, Services and Retail — revenue, cost, people, data confidence and the exception register — with the SAP landscape and maintenance workspaces underneath.",
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
