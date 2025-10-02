import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home | Your Portfolio",
  description: "macOS-themed portfolio built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="m-0 p-0 font-mono">
        {children}
      </body>
    </html>
  );
}
