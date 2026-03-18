import type { Metadata } from "next";
import { Tiro_Devanagari_Marathi } from "next/font/google";
import "../styles/globals.css";
import { siteConfig } from "@/config/site";

const tiroDevanagariMarathi = Tiro_Devanagari_Marathi({
  weight: ["400"],
  subsets: ["devanagari", "latin"],
  variable: "--font-tiro-devanagari",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`antialiased font-sans ${tiroDevanagariMarathi.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
