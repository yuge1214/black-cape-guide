"use client";

import { useEffect, useState } from "react";

interface LogoRevealProps {
  show: boolean;
  onStart: () => void;
}

export default function LogoReveal({ show, onStart }: LogoRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoPhase2, setLogoPhase2] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [startClickable, setStartClickable] = useState(false);
  const fullText = "Welcome Back , Yuge";

  // 启动入场动画
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setRevealed(true), 100);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // 打字机效果
  useEffect(() => {
    if (!revealed) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        // 打字完成后: 副标题 → Logo Phase1(图标居中渐显0.5s) → Phase2(图标左移+文字从图标中间出现右移0.7s ease-out) → 停留1s → 渐隐0.5s → 0.5s后START
        setTimeout(() => setShowSubtitle(true), 300);
        setTimeout(() => setShowLogo(true), 1200);
        setTimeout(() => setLogoPhase2(true), 1200 + 500);
        setTimeout(() => setShowLogo(false), 1200 + 500 + 700 + 1000);
        setTimeout(() => setShowStart(true), 1200 + 500 + 700 + 1000 + 500);
        setTimeout(() => setStartClickable(true), 1200 + 500 + 700 + 1000 + 500 + 300);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [revealed]);

  if (!show) return null;

  return (
    <div className="relative w-full">
      <div className="relative mx-auto max-w-4xl px-6 -mt-[50px]">
        <div
          className={`relative transition-all duration-1000 ${
            revealed
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <div className="relative flex flex-col items-center">
            {/* 打字机主标题 */}
            <h1 className="relative z-10 mt-8 mb-4 text-4xl font-bold tracking-wider sm:text-5xl md:text-6xl min-h-[1.2em]">
              <span
                className="bg-gradient-to-br from-[#f8f9fa] via-[#e9ecef] to-[#adb5bd] bg-clip-text text-transparent"
                style={{ textShadow: "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.1)" }}
              >
                {typedText}
              </span>
            </h1>

            {/* 副标题 */}
            <div
              className={`transition-all duration-700 ${
                showSubtitle
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p
                className="text-3xl tracking-widest bg-gradient-to-br from-[#f8f9fa] via-[#e9ecef] to-[#adb5bd] bg-clip-text text-transparent sm:text-4xl"
                style={{ textShadow: "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.1)" }}
              >
                欢迎回家,雨鸽大人!
              </p>
            </div>

            {/* Logo + 文字（Phase1: 图标居中渐显 → Phase2: 图标左移+文字从图标中间出现右移） */}
            <div
              id="reveal-wrapper"
              className={`mt-10 flex flex-row items-center justify-center transition-all duration-500 ${
                showLogo
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {/* 图标 - 先居中渐显，后左移 */}
              <div
                className={`flex-shrink-0 transition-all duration-700 ease-out ${
                  showLogo || logoPhase2
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                } ${
                  logoPhase2
                    ? "-translate-x-5"
                    : "translate-x-0"
                }`}
              >
                <img
                  src="./tsg-0324(1).png?v=2"
                  alt="黑蓑影卫"
                  className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                  style={{
                    filter: "brightness(1.8) contrast(1.0) grayscale(0.1) saturate(0.7)",
                  }}
                />
              </div>

              {/* 文字 - 从图标中间出现，向右移动到图标右侧 */}
              <h2
                className={`text-2xl font-bold tracking-wider bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 bg-clip-text text-transparent sm:text-3xl md:text-4xl drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] -ml-[32px] transition-all duration-700 ease-out ${
                  logoPhase2
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                黑蓑影卫攻略组
              </h2>
            </div>

            {/* START 按钮 */}
            <div
              id="start-btn"
              className={`-mt-[78px] flex flex-col items-center gap-6 transition-all duration-700 ${
                showStart
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } ${startClickable ? "pointer-events-auto" : "pointer-events-none"}`}
            >
              <div className="flex items-center gap-5">
                {/* 左侧装饰线 */}
                <div className="h-px w-[254px] rounded-full bg-gradient-to-r from-transparent to-zinc-400 sm:w-[286px]" />

                {/* START 按钮 */}
                <button
                  onClick={onStart}
                  disabled={!startClickable}
                  className="group relative flex h-20 w-20 cursor-pointer items-center justify-center sm:h-24 sm:w-24"
                >
                  {/* 顺时针旋转容器：圆环 + 断口 + 十字星 */}
                  <span className="absolute inset-0 animate-spin-slow">
                    {/* 细白圆环 */}
                    <span className="absolute inset-0 rounded-full border border-white/60" />

                    {/* 顶部断口遮罩 */}
                    <span className="absolute top-0 left-1/2 h-1.5 w-3 -translate-x-1/2 -translate-y-1/2 bg-black" />
                    {/* 底部断口遮罩 */}
                    <span className="absolute bottom-0 left-1/2 h-1.5 w-3 -translate-x-1/2 translate-y-1/2 bg-black" />

                    {/* 顶部十字星 */}
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white/60 sm:text-sm">
                      +
                    </span>
                    {/* 底部十字星 */}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs text-white/60 sm:text-sm">
                      +
                    </span>
                  </span>

                  {/* START 文字（不旋转） */}
                  <span
                    className="relative z-10 text-xs font-bold tracking-[0.3em] bg-gradient-to-br from-[#f8f9fa] via-[#e9ecef] to-[#adb5bd] bg-clip-text text-transparent transition-colors group-hover:from-white group-hover:via-[#f8f9fa] group-hover:to-[#ced4da] sm:text-sm"
                    style={{ textShadow: "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.1)" }}
                  >
                    START
                  </span>
                </button>

                {/* 右侧装饰线 */}
                <div className="h-px w-[254px] rounded-full bg-gradient-to-l from-transparent to-zinc-400 sm:w-[286px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}