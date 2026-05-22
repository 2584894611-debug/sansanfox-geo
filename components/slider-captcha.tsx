"use client";

import { useCallback, useRef, useState } from "react";

interface SliderCaptchaProps {
  onVerified: (token: string) => void;
  onReset?: () => void;
}

/**
 * 自研滑块验证码组件
 * 不依赖外部服务，国内无障碍
 * 滑块通过后向 /api/captcha 请求服务端签名token
 */
export function SliderCaptcha({ onVerified, onReset }: SliderCaptchaProps) {
  const [status, setStatus] = useState<"idle" | "dragging" | "success" | "error">("idle");
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const [errorMsg, setErrorMsg] = useState("");

  const trackWidth = 280;

  const handleStart = useCallback((clientX: number) => {
    if (status === "success") return;
    startXRef.current = clientX;
    setStatus("dragging");
    setErrorMsg("");
  }, [status]);

  const handleMove = useCallback((clientX: number) => {
    if (status !== "dragging") return;
    const diff = clientX - startXRef.current;
    const clamped = Math.max(0, Math.min(diff, trackWidth - 44));
    setOffset(clamped);
  }, [status, trackWidth]);

  const handleEnd = useCallback(async () => {
    if (status !== "dragging") return;

    // 滑到有效行程的90%以上算通过
    const maxOffset = trackWidth - 44;
    if (offset >= maxOffset * 0.88) {
      setStatus("success");
      setOffset(trackWidth - 44);

      // 向后端请求签名token
      try {
        const res = await fetch("/api/captcha", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          onVerified(data.token);
        } else {
          setStatus("error");
          setErrorMsg("验证服务异常，请重试");
          setTimeout(() => {
            setOffset(0);
            setStatus("idle");
            onReset?.();
          }, 1500);
        }
      } catch {
        setStatus("error");
        setErrorMsg("网络异常，请重试");
        setTimeout(() => {
          setOffset(0);
          setStatus("idle");
          onReset?.();
        }, 1500);
      }
    } else {
      // 没滑到位，弹回
      setStatus("idle");
      setOffset(0);
    }
  }, [status, offset, trackWidth, onVerified, onReset]);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
    const onMouseMove = (ev: MouseEvent) => handleMove(ev.clientX);
    const onMouseUp = () => {
      handleEnd();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
    const onTouchMove = (ev: TouchEvent) => handleMove(ev.touches[0].clientX);
    const onTouchEnd = () => {
      handleEnd();
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  };

  const progress = offset / (trackWidth - 44);

  return (
    <div className="w-full max-w-[300px]">
      <div
        ref={trackRef}
        className="relative h-11 rounded-lg border border-[#E2E8F0] bg-[#F7FAFC] select-none overflow-hidden"
        style={{ width: trackWidth }}
      >
        {/* 进度条 */}
        <div
          className="absolute inset-y-0 left-0 rounded-l-lg transition-none"
          style={{
            width: `${offset + 22}px`,
            background: status === "success"
              ? "linear-gradient(90deg, #48BB78, #38A169)"
              : "linear-gradient(90deg, #E65F2B, #DD6B20)",
            opacity: 0.15,
          }}
        />

        {/* 文字提示 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {status === "success" ? (
            <span className="text-sm font-medium text-[#38A169]">验证通过</span>
          ) : status === "error" ? (
            <span className="text-sm text-[#B83232]">{errorMsg}</span>
          ) : (
            <span className="text-sm text-[#A0AEC0]">
              {status === "dragging" ? "继续拖动..." : "向右拖动滑块完成验证"}
            </span>
          )}
        </div>

        {/* 滑块 */}
        <div
          className={`absolute top-0.5 h-[40px] w-[42px] rounded-md flex items-center justify-center cursor-grab shadow-sm transition-none ${
            status === "success"
              ? "bg-[#38A169] cursor-default"
              : status === "error"
              ? "bg-[#E53E3E] cursor-default"
              : "bg-white border border-[#CBD5E0] hover:border-[#E65F2B] active:cursor-grabbing"
          }`}
          style={{ left: `${offset}px` }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          {status === "success" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : status === "error" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={status === "dragging" ? "#E65F2B" : "#A0AEC0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
