import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Background from "@/components/Background";


export const metadata: Metadata = {
  title: "Ask Twilight",
  description: "Connect the stars, come ask twilight.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Background />
        <NavBar />
        {children}
      </body>
    </html>
  );
}