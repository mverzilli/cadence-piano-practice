import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cadence — Assisted Piano Practice",
  description: "A thoughtful piano practice companion for diagnosing, experimenting, and building reliable control.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Cadence — Assisted Piano Practice",
    description: "Don’t just repeat it. Solve it.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cadence — Assisted Piano Practice",
    description: "Don’t just repeat it. Solve it.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
