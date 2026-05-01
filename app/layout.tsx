import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://nicolab.studio"),
  title: "NICO studio",
  description: "NICO studio — The Launch Crew",
  /** Дублируем в явном `<head>` — часть мобильных браузеров лучше подхватывает статические `<link rel="icon">`. */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

/** Не использовать тёмную color-scheme ОС для canvas/формы/скроллбаров страницы. */
export const viewport: Viewport = {
  /** Сильнее, чем `light`: не даём двойное оформление под тёмную ОС (Samsung Internet и др.). */
  colorScheme: "only light",
  /** Не давать браузерам/In-App WebView (X/Telegram и т.д.) красить панели в чёрный при тёмной теме клиента */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3f3" },
    { media: "(prefers-color-scheme: dark)", color: "#f3f3f3" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="only light" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body
        className={`${manrope.variable} ${bebasNeue.variable} ${abhaya.variable} ${oswald.variable} antialiased bg-[var(--bg)] text-[var(--foreground)]`}
      >
        {children}
      </body>
    </html>
  );
}
