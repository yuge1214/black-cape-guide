import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import BackToTop from "@/components/BackToTop";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "文章未找到" };
  }
  return {
    title: `${article.title} | 黑蓑影卫攻略组`,
    description: article.summary,
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/#main-content"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-accent"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回最新攻略
        </Link>
      </div>

      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {article.category}
          </span>
          <span className="text-sm text-zinc-500">{article.date}</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight metal-text sm:text-4xl">
          {article.title}
        </h1>

        <p className="mb-6 text-lg text-zinc-400">{article.summary}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-metal-mid text-xs text-accent">
              {article.author.charAt(0)}
            </div>
            <span>{article.author}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-metal-dark px-2 py-1 text-xs text-zinc-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        {article.content.split("\n").map((line, index) => {
          if (line.startsWith("# ")) {
            return (
              <h1 key={index} className="mb-6 text-2xl font-bold metal-text">
                {line.slice(2)}
              </h1>
            );
          } else if (line.startsWith("## ")) {
            return (
              <h2
                key={index}
                className="mb-4 mt-8 text-xl font-semibold text-foreground"
              >
                {line.slice(3)}
              </h2>
            );
          } else if (line.startsWith("### ")) {
            return (
              <h3
                key={index}
                className="mb-3 mt-6 text-lg font-medium text-accent"
              >
                {line.slice(4)}
              </h3>
            );
          } else if (line.match(/^\d+\./)) {
            return (
              <p key={index} className="mb-2 pl-4 text-foreground">
                {line}
              </p>
            );
          } else if (line.trim() === "") {
            return <br key={index} />;
          } else {
            return (
              <p key={index} className="mb-4 leading-relaxed text-zinc-300">
                {line}
              </p>
            );
          }
        })}
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <Link
            href="/#main-content"
            className="rounded-lg border border-border bg-card px-6 py-2 text-sm text-foreground transition-all hover:border-accent hover:text-accent"
          >
            ← 更多攻略
          </Link>

          <BackToTop />
        </div>
      </div>
    </article>
  );
}

export function generateStaticParams() {
  return getArticles().map((article) => ({
    slug: article.slug,
  }));
}