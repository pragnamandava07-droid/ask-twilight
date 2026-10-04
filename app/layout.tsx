import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Background from "@/components/Background";

export const metadata: Metadata = {
  title: "Ask Twilight",
  description: "Ask anything about your customers. Remember everything.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Background />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
