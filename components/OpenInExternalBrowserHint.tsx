"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nico-external-browser-hint-dismissed";

function detectsInAppWebView(ua: string): boolean {
  if (!/Mobi|Android|iPhone|iPad|iPod|webOS/i.test(ua)) return false;

  if (/Instagram/i.test(ua)) return true;
  if (/(FB_IAB|FBAN|FBAV|FB4A)/i.test(ua)) return true;
  if (/\bTwitter/i.test(ua)) return true;
  if (/Twitter for (iPhone|Android)/i.test(ua)) return true;
  if (/\bTikTok/i.test(ua)) return true;
  if (/\bSnapchat\b/i.test(ua)) return true;
  if (/\bLinkedIn-/i.test(ua)) return true;
  if (/\bMicroMessenger\b/i.test(ua)) return true;
  if (/\bLine\//i.test(ua)) return true;
  if (/\bTelegram\b/i.test(ua)) return true;
  if (/Pinterest\/\d+/i.test(ua)) return true;

  /** X (Android клиент может отдавать разные строки) */
  if (/\bX\/Android\b/i.test(ua) || /\bTwitterAndroid\b/i.test(ua)) return true;

  /**
   * Android WebView (часто у «открыть внутри приложения» без отдельного маркера).
   */
  const androidWebViewShell = /\bAndroid\b/i.test(ua) && /\bwv\b/.test(ua);
  const mobileChromeSafariFingerprint = /\bChrome\/[\d.]+ Mobile Safari\/[\d.]+\s*$/i.test(ua);
  if (androidWebViewShell && mobileChromeSafariFingerprint) return true;

  return false;
}

/**
 * Короткая подсказка: открыть сайт во внешнем браузере во встроенных WebView (X, Instagram…).
 */
export function OpenInExternalBrowserHint() {
  const [show, setShow] = useState(false);
  const [href, setHref] = useState("");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* режим приватности / блок storage */
    }
    const ua = typeof navigator !== "undefined" ? (navigator.userAgent ?? "") : "";
    if (!detectsInAppWebView(ua)) return;
    setHref(window.location.href);
    setShow(true);
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  async function copyLink() {
    try {
      await navigator.clipboard?.writeText(href);
    } catch {
      /* ignore */
    }
  }

  if (!show || !href) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[120] px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 lg:hidden"
      role="region"
      aria-label="Рекомендация открыть в браузере"
    >
      <div className="mx-auto flex max-w-[min(100%,480px)] flex-col gap-2 rounded-2xl border border-black/[0.06] bg-white/95 px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop-blur-sm">
        <div className="flex items-start justify-between gap-2">
          <p className="text-left font-sans text-[14px] leading-[1.45] tracking-[-0.02em] text-[#181818]">
            Откройте сайт во внешнем браузере — во встроенном окне (например, из ленты) цвета и фон иногда
            отображаются неверно.
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-full px-2 py-1 font-sans text-[12px] text-[#181818]/50 transition-colors hover:text-[#181818]"
          >
            Скрыть
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#ebb55c] px-5 font-sans text-[14px] font-bold tracking-[-0.02em] text-white shadow-[0_12px_32px_rgba(235,181,92,0.35)] transition-[filter] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#181818]/25"
          >
            Открыть в браузере
          </a>
          <button
            type="button"
            onClick={() => void copyLink()}
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 bg-transparent px-4 font-sans text-[13px] font-semibold tracking-[-0.02em] text-[#181818] hover:bg-black/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ebb55c]"
          >
            Копировать ссылку
          </button>
        </div>
      </div>
    </div>
  );
}
