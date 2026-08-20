"use client";

import { useEffect, useState } from "react";
import SakuraScene from "./SakuraScene";

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

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setRevealed(true), 100);
      return () => clearTimeout(timer);
    }
  }, [show]);

  useEffect(() => {
    if (!revealed) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
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
    <div className="fixed inset-0 w-full h-full">
      <SakuraScene />

      <div className="relative z-10 mx-auto max-w-6xl px-6 h-full flex items-center">
        <div
          className={`w-full transition-all duration-1000 ${
            revealed
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <div className="flex flex-col items-start max-w-xl">
            <h1 className="relative z-10 mt-8 mb-4 text-4xl font-bold tracking-wider sm:text-5xl md:text-6xl min-h-[1.2em]">
              <span
                className="bg-gradient-to-br from-[#f8f9fa] via-[#e9ecef] to-[#adb5bd] bg-clip-text text-transparent"
                style={{ textShadow: "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.1)" }}
              >
                {typedText}
              </span>
            </h1>

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

            <div className="mt-[1cm] h-24 sm:h-28 relative">
              {/* Logo 区域 */}
              <div
                className={`absolute inset-0 flex flex-row items-center transition-all duration-500 ${
                  showLogo
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <div
                  className={`flex-shrink-0 transition-all duration-700 ease-out ${
                    showLogo || logoPhase2
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75"
                  }`}
                >
                  <img
                    src="/black-cape-guide/tsg-0324(1).png?v=2"
                    alt="黑蓑影卫"
                    className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                    style={{
                      filter: "brightness(1.8) contrast(1.0) grayscale(0.1) saturate(0.7)",
                    }}
                  />
                </div>
                <h2
                  className={`ml-4 text-2xl font-bold tracking-wider bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 bg-clip-text text-transparent sm:text-3xl md:text-4xl drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-all duration-700 ease-out whitespace-nowrap ${
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
                className={`absolute inset-0 flex items-center transition-all duration-700 ${
                  showStart
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                } ${startClickable ? "pointer-events-auto" : "pointer-events-none"}`}
              >
                <div
                  onClick={startClickable ? onStart : undefined}
                  style={{
                    position: "relative",
                    width: "80px",
                    height: "80px",
                    textAlign: "center",
                    cursor: startClickable ? "pointer" : "default",
                  }}
                >
                  {/* 旋转层 - 两个圆弧+缺口+星星 */}
                  <div
                    className="animate-spin-slow"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      {/* 定义完整圆形路径 */}
                      <defs>
                        <path
                          id="circlePath"
                          d="M 40 5 A 35 35 0 1 1 40 75 A 35 35 0 1 1 40 5"
                          fill="none"
                        />
                      </defs>
                      
                      {/* 圆弧1 - 使用虚线创建缺口 */}
                      <use
                        href="#circlePath"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeDasharray="90 220"
                        strokeDashoffset="-10"
                      />
                      
                      {/* 圆弧2 - 使用虚线创建缺口 */}
                      <use
                        href="#circlePath"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeDasharray="90 150"
                        strokeDashoffset="-120"
                      />
                      
                      {/* 上方五角星 - 在上缺口中心，缩小37.5% */}
                      <g transform="translate(40, 5) rotate(0) scale(0.625)">
                        <path
                          d="M0 -5L1.5 -1.5L5 -1L2.5 1L3.5 5L0 2.5L-3.5 5L-2.5 1L-5 -1L-1.5 -1.5Z"
                          fill="rgba(255,255,255,0.6)"
                        />
                        <line x1="0" y1="0" x2="0" y2="-3" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="2.5" y2="-1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="1.5" y2="2" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-1.5" y2="2" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-2.5" y2="-1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeLinecap="round" />
                      </g>
                      
                      {/* 下方五角星 - 在下缺口中心，缩小37.5% */}
                      <g transform="translate(40, 75) rotate(180) scale(0.625)">
                        <path
                          d="M0 -5L1.5 -1.5L5 -1L2.5 1L3.5 5L0 2.5L-3.5 5L-2.5 1L-5 -1L-1.5 -1.5Z"
                          fill="rgba(255,255,255,0.6)"
                        />
                        <line x1="0" y1="0" x2="0" y2="-3" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="2.5" y2="-1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="1.5" y2="2" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-1.5" y2="2" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-2.5" y2="-1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>

                  {/* START 文本 - 用 line-height 垂直居中 + text-align 水平居中 */}
                  <span
                    style={{
                      position: "relative",
                      zIndex: 10,
                      display: "inline-block",
                      verticalAlign: "middle",
                      lineHeight: "80px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      letterSpacing: "0.3em",
                      background: "linear-gradient(to bottom right, #f8f9fa, #e9ecef, #adb5bd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textShadow: "0 0 10px rgba(255,255,255,0.3)",
                      whiteSpace: "nowrap",
                      paddingLeft: "15px",
                    }}
                  >
                    START
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}