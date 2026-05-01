import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devfolio",
  description: "Build your developer portfolio in 10 minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#07070d]">
      <body className="bg-[#07070d] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
