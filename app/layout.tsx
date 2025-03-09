import type { Metadata } from "next";
import { Audiowide, Orbitron, Press_Start_2P } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const audiowide = Audiowide({
  variable: "--font-audiowide",
  weight: "400",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SNNB HACKATHON",
  description: "SNNB HACKATHON - A Cyberpunk Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${audiowide.variable} ${pressStart2P.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}