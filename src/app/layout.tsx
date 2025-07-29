import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Repo Genie",
  description: "An app that generates entire code base with AI.",
  keywords: ["AI", "Code Generator", "Repo Genie", "Next.js", "OpenAI"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Repo Genie",
    description: "Generate apps with AI in seconds.",
    url: "https://repogenie.vercel.app/",
    siteName: "Repo Genie",
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster theme="dark" richColors closeButton />
      </body>
    </html>
  );
}
