import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RegioSync - Fresh from Your Region",
  description: "Connect directly with local farmers, artisans, and producers in your area.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
