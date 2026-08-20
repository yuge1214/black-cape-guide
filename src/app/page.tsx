"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SplashScreen from "@/components/SplashScreen";
import LogoReveal from "@/components/LogoReveal";
import ScrollReveal from "@/components/ScrollReveal";
import StarfieldBackground from "@/components/StarfieldBackground";
import { useFullScroll } from "@/hooks/useFullScroll";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { getArticles } from "@/lib/articles";
import { useNavContext } from "@/context/NavContext";
import type { Article } from "@/types";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [landingPhase, setLandingPhase] = useState<"visible" | "fading-out" | "hidden">("visible");
  const [mainRevealed, setMainRevealed] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const { setShowNavLinks } = useNavContext();

  useFullScroll(".snap-section", {
    scrollDuration: 300,
    allowLastSectionScroll: true,
  });

  useSectionScroll(".snap-section");

  // 加载完成后显示初始页面（跳过入场动画）
  useEffect(() => {
    setShowNavLinks(false);
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [setShowNavLinks]);

  useEffect(() => {
    const fetched = getArticles().slice(0, 3);
    setArticles(fetched);
  }, []);

  const handleStart = () => {
    sessionStorage.setItem("hasStarted", "true");
    setLandingPhase("fading-out");
    setMainRevealed(true);
    setShowNavLinks(true);
    setTimeout(() => setLandingPhase("hidden"), 800);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 初始页面 - 星空背景 + LogoReveal */}
      {landingPhase !== "hidden" && (
        <section
          id="landing"
          className={`fixed inset-0 z-50 overflow-hidden ${
            landingPhase === "fading-out" ? "animate-landing-out" : ""
          }`}
        >
          <StarfieldBackground />
          <LogoReveal show={true} onStart={handleStart} />
        </section>
      )}

      {/* 后续内容区 */}
      <div
        id="main-content"
        className={`relative z-40 ${mainRevealed ? "animate-main-in" : "content-hidden"}`}
      >
        <div className="section-divider" />

        <section className="snap-section px-6 py-20">
          <div className="w-full max-w-6xl mx-auto py-16">
            <ScrollReveal animation="up" threshold={0.6}>
              <div className="mb-12 flex items-center justify-between">
                <h3 className="text-3xl font-bold">关于我是谁?</h3>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="up" threshold={0.6}>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="mx-auto h-32 w-32 rounded-full metal-border-strong p-1 overflow-hidden animate-glow-pulse">
                      <img
                        src="/black-cape-guide/avatar.jpg"
                        alt="头像"
                        className="h-full w-full object-cover rounded-full"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-2 border-background bg-green-500" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="mb-3 text-4xl font-bold metal-text">雨鸽</h3>
                  <p className="mb-4 text-xl text-accent">黑蓑影卫攻略组 · 组员</p>
                  <p className="max-w-2xl text-base text-zinc-400 leading-relaxed">
                    你好,我是雨鸽,兴趣是危机合约与高难的攻略。
                    我希望通过我的努力,攻克更多高难关卡,让更多玩家体会明日方舟的乐趣。
                  </p>
                  <div className="mt-8">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-medium text-black transition-colors hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
                    >
                      了解更多 →
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        <section id="latest-guides" className="snap-section px-6 py-20">
          <div className="w-full max-w-6xl mx-auto py-16">
            <ScrollReveal animation="up" threshold={0.6}>
              <div className="mb-12 flex items-center justify-between">
                <h3 className="text-3xl font-bold">最新攻略</h3>
                <Link
                  href="/articles"
                  className="text-base text-accent hover:underline"
                >
                  查看全部 →
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid gap-8 md:grid-cols-3">
              {articles.map((article, index) => (
                <ScrollReveal
                  key={article.id}
                  animation="up"
                  delay={index * 150}
                  threshold={0.6}
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group block h-full"
                  >
                    <div className="metal-border card-hover h-full rounded-xl bg-card p-8">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="rounded bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                          {article.category}
                        </span>
                        <span className="text-sm text-zinc-500">
                          {article.date}
                        </span>
                      </div>
                      <h4 className="mb-4 text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
                        {article.title}
                      </h4>
                      <p className="text-base text-zinc-400 line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}