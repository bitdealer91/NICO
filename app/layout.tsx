import type { Metadata } from "next";
import { Abhaya_Libre, Bebas_Neue, Manrope, Oswald } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const abhaya = Abhaya_Libre({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["600"],
});

const oswald = Oswald({
  variable: "--font-nav",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "NICO studio",
  description: "NICO studio — The Launch Crew",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${bebasNeue.variable} ${abhaya.variable} ${oswald.variable} antialiased bg-[var(--bg)] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
