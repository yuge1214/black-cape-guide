"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { getArticles, getCategories } from "@/lib/articles";
import type { Article } from "@/types";

function ArticlesContent() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "全部"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setArticles(getArticles());
    setCategories(["全部", ...getCategories()]);
  }, []);

  const filteredArticles = useMemo(() => {
    let result = articles;

    if (activeCategory !== "全部") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.summary.toLowerCase().includes(query) ||
          a.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return result;
  }, [articles, activeCategory, searchQuery]);

  return (
    <div>
      <section className="snap-section px-6 pt-20 pb-20">
        <div className="w-full max-w-6xl mx-auto py-16">
          <ScrollReveal animation="down" threshold={0.6}>
            <div className="mb-16 text-center">
              <h1 className="mb-4 text-5xl font-bold metal-text">攻略文章</h1>
              <p className="text-xl text-zinc-400">浏览所有明日方舟攻略内容</p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="up" threshold={0.6}>
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-5 py-2 text-base transition-all ${
                      activeCategory === category
                        ? "bg-accent text-black shadow-lg shadow-accent/20"
                        : "bg-metal-mid text-zinc-400 hover:bg-metal-light hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-5 py-3 pl-12 text-base text-foreground placeholder-zinc-500 outline-none transition-all focus:border-accent focus:shadow-lg focus:shadow-accent/10 sm:w-72"
                />
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <ScrollReveal
                key={article.id}
                animation="up"
                delay={index * 100}
                threshold={0.6}
              >
                <Link
                  href={`/articles/${article.slug}`}
                  className="group block h-full"
                >
                  <article className="metal-border card-hover h-full rounded-xl bg-card p-8">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="rounded bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                        {article.category}
                      </span>
                      <span className="text-sm text-zinc-500">{article.date}</span>
                    </div>

                    <h2 className="mb-4 text-2xl font-semibold text-foreground transition-colors group-hover:text-accent">
                      {article.title}
                    </h2>

                    <p className="mb-5 text-base leading-relaxed text-zinc-400 line-clamp-3">
                      {article.summary}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-metal-dark px-3 py-1 text-sm text-zinc-500"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{article.author}</span>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <ScrollReveal animation="up" threshold={0.6}>
              <div className="py-24 text-center">
                <p className="text-xl text-zinc-500">暂无符合条件的文章</p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-zinc-500">加载中...</div>}>
      <ArticlesContent />
    </Suspense>
  );
}