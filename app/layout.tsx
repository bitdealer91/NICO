import type { Metadata, Viewport } from "next";
import { Abhaya_Libre, Bebas_Neue, Manrope, Oswald } from "next/font/google";

import { InAppWebViewPaintFix } from "@/components/InAppWebViewPaintFix";
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
  /** Samsung Force Dark / WebView — сильнее, чем `light`. */
  colorScheme: "only light",
  /** Не давать браузерам/In-App WebView (X/Telegram и т.д.) красить панели в чёрный при тёмной теме клиента */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-white text-[#181818]"
      style={{ backgroundColor: "#ffffff", colorScheme: "only light" }}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="only light" />
        {/* Подсказка WebKit/Blink для in-app WebView (X, Instagram и т.д.) */}
        <meta name="supported-color-schemes" content="light" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "!function(){var b='#ffffff',c='#181818',h=document.documentElement;h.style.setProperty('background-color',b,'important');h.style.setProperty('color-scheme','only light','important');h.style.setProperty('color',c,'important');function t(){if(document.body){document.body.style.setProperty('background-color',b,'important');document.body.style.setProperty('color-scheme','only light','important');document.body.style.setProperty('color',c,'important')}}t();document.addEventListener('DOMContentLoaded',t)}();",
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body
        className={`${manrope.variable} ${bebasNeue.variable} ${abhaya.variable} ${oswald.variable} antialiased`}
        style={{ backgroundColor: "#ffffff", color: "#181818", colorScheme: "only light" }}
      >
        <InAppWebViewPaintFix />
        <div
          id="nico-app-shell"
          className="nico-app-shell min-h-[100dvh] bg-[var(--bg)] text-[var(--foreground)]"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--foreground)",
            colorScheme: "only light",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
