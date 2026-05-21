"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
}

/**
 * Cloudflare Turnstile 验证码 Hook
 * 不依赖第三方npm包，直接加载官方JS SDK
 */
export function useTurnstile(siteKey: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptLoadedRef = useRef(false);
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);

  // 加载Turnstile JS
  useEffect(() => {
    if (!siteKey) {
      setIsReady(true);
      return;
    }

    if (scriptLoadedRef.current) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      renderWidget();
    };
    document.head.appendChild(script);

    return () => {
      // 清理
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
      }
    };
  }, [siteKey]);

  // 渲染验证码组件
  function renderWidget() {
    if (!siteKey || !containerRef.current || !window.turnstile) return;

    // 清理旧的
    if (widgetIdRef.current) {
      try { window.turnstile.remove(widgetIdRef.current); } catch {}
    }

    // 清空容器
    containerRef.current.innerHTML = "";

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (t: string) => {
        setToken(t);
        setIsReady(true);
      },
      "error-callback": () => {
        setToken("");
        setIsReady(true);
      },
      "expired-callback": () => {
        setToken("");
      },
      theme: "light",
      size: "normal"
    });
  }

  // 重置验证码
  function reset() {
    setToken("");
    if (widgetIdRef.current && window.turnstile) {
      try { window.turnstile.reset(widgetIdRef.current); } catch {}
    }
  }

  return { containerRef, token, reset, isReady };
}
