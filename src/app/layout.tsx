import type { Metadata } from "next";
import { Tiro_Devanagari_Marathi } from "next/font/google";
import "./globals.css";

const tiroDevanagariMarathi = Tiro_Devanagari_Marathi({
  weight: ["400"],
  subsets: ["devanagari", "latin"],
  variable: "--font-tiro-devanagari",
});

export const metadata: Metadata = {
  title: "Project X - Medical Research Assistant",
  description: "Intelligent AI assistant with advanced search capabilities for medical research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased font-sans ${tiroDevanagariMarathi.variable}`}>
        {children}
      </body>
    </html>
  );
}
