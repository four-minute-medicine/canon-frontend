import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
