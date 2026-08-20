"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useFullScroll } from "@/hooks/useFullScroll";
import { useSectionScroll } from "@/hooks/useSectionScroll";

export default function AboutPage() {
  useFullScroll(".snap-section", {
    scrollDuration: 300,
    allowLastSectionScroll: true,
  });

  useSectionScroll(".snap-section");

  const skills = [
    { name: "明日方舟攻略者", level: 100 },
    { name: "思路构建", level: 90 },
    { name: "塑料水平", level: 95 },
    { name: "高情商发言(串子)", level: 88 },
  ];

  const timeline = [
    { year: "2021", event: "开始加入明日方舟,成为一名普通玩家" },
    { year: "2023", event: "成为深海队攻略者,提供大量深海队课题" },
    { year: "2025", event: "加入黑蓑影卫攻略组,正式成为一名组员" },
    { year: "2026-至今", event: "持续专注高难关卡与危机合约的攻略" },
  ];

  return (
    <div>
      {/* 头部介绍 */}
      <section className="snap-section px-6 pt-20 pb-20">
        <div className="w-full max-w-4xl mx-auto py-16">
          <ScrollReveal animation="down" threshold={0.6}>
            <div className="text-center">
              <div className="mb-8 inline-block">
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

              <h1 className="mb-3 text-5xl font-bold metal-text">雨鸽</h1>
              <p className="mb-6 text-xl text-accent">黑蓑影卫攻略组 · 组员</p>
              <p className="mx-auto max-w-2xl text-lg text-zinc-400 leading-relaxed">
                你好,我是雨鸽,兴趣是危机合约与高难的攻略。
                我希望通过我的努力,攻克更多高难关卡,让更多玩家体会明日方舟的乐趣。
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* 技能专长 */}
      <section className="snap-section px-6">
        <div className="w-full max-w-4xl mx-auto py-16">
          <ScrollReveal animation="up" threshold={0.6}>
            <h2 className="mb-12 text-3xl font-bold">技能专长</h2>
          </ScrollReveal>
          <div className="space-y-8">
            {skills.map((skill, index) => (
              <ScrollReveal
                key={skill.name}
                animation="left"
                delay={index * 100}
                threshold={0.6}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-lg font-medium text-foreground">
                      {skill.name}
                    </span>
                    <span className="text-lg text-accent">{skill.level}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-metal-mid">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* 经历时间线 */}
      <section className="snap-section px-6">
        <div className="w-full max-w-4xl mx-auto py-16">
          <ScrollReveal animation="up" threshold={0.6}>
            <h2 className="mb-12 text-3xl font-bold">经历时间线</h2>
          </ScrollReveal>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-border to-transparent" />
            {timeline.map((item, index) => (
              <ScrollReveal
                key={index}
                animation="left"
                delay={index * 150}
                threshold={0.6}
              >
                <div className="relative mb-12 pl-16">
                  <div className="absolute left-3 top-1.5 h-7 w-7 rounded-full border-2 border-accent bg-background shadow-lg shadow-accent/20" />
                  <div className="metal-border card-hover rounded-xl bg-card p-6">
                    <span className="mb-2 inline-block rounded bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
                      {item.year}
                    </span>
                    <p className="text-lg text-foreground">{item.event}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* 联系方式 */}
      <section className="snap-section px-6">
        <div className="w-full max-w-4xl mx-auto py-16">
          <ScrollReveal animation="up" threshold={0.6}>
            <h2 className="mb-12 text-3xl font-bold">联系方式</h2>
            <div className="metal-border rounded-xl bg-card p-10 text-center">
              <p className="mb-8 text-lg text-zinc-400">
                如果您有任何问题、建议或合作意向,不欢迎通过以下方式联系我(不是):
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a
                  href="mailto:contact@blackcape.com"
                  className="group btn-glow inline-flex items-center gap-3 rounded-lg bg-accent px-8 py-4 text-base font-medium text-black transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  发送邮件
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-lg border border-border px-8 py-4 text-base font-medium text-foreground transition-all hover:border-accent hover:text-accent"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}