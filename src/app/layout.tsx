import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oxlas - Private. Branded. Powerful.",
  description: "Oxlas is a fully open-source, self-hosted productivity suite that replaces Google Workspace with zero third-party branding.",
  keywords: ["Oxlas", "productivity", "workspace", "email", "calendar", "files", "video conferencing", "open source", "self-hosted"],
  authors: [{ name: "Oxlas Technologies Inc." }],
  openGraph: {
    title: "Oxlas - Private. Branded. Powerful.",
    description: "Fully open-source, self-hosted productivity suite with zero third-party branding.",
    url: "https://oxlas.com",
    siteName: "Oxlas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oxlas - Private. Branded. Powerful.",
    description: "Fully open-source, self-hosted productivity suite with zero third-party branding.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
