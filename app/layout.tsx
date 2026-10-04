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
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;800&family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Background />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
