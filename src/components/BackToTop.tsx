"use client";

export default function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="rounded-lg bg-metal-mid px-6 py-2 text-sm text-zinc-300 transition-all hover:bg-metal-light hover:text-foreground"
    >
      返回顶部 ↑
    </button>
  );
}