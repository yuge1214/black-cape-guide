"use client";

import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { useFullScroll } from "@/hooks/useFullScroll";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { getArticles, addArticle, deleteArticle } from "@/lib/articles";
import type { Article } from "@/types";

export default function AdminPage() {
  useFullScroll(".snap-section", {
    scrollDuration: 300,
    allowLastSectionScroll: true,
  });

  useSectionScroll(".snap-section");
  const [articles, setArticles] = useState<Article[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "",
    tags: "",
  });

  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    const newArticle = {
      slug: formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      date: new Date().toISOString().split("T")[0],
      author: "黑蓑影卫",
    };

    addArticle(newArticle);
    setArticles(getArticles());
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这篇文章吗?")) {
      deleteArticle(id);
      setArticles(getArticles());
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      summary: "",
      content: "",
      category: "",
      tags: "",
    });
    setEditingArticle(null);
  };

  return (
    <div>
      <section className="snap-section px-6 pt-20">
        <div className="w-full max-w-6xl mx-auto py-16">
          <ScrollReveal animation="down" threshold={0.6}>
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h1 className="mb-3 text-5xl font-bold metal-text">后台管理</h1>
                <p className="text-lg text-zinc-400">管理您的攻略文章内容</p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-lg font-medium text-black transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                新建文章
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="up" threshold={0.6}>
            <div className="mb-12 grid gap-6 sm:grid-cols-3">
              <div className="metal-border rounded-xl bg-card p-8">
                <div className="text-4xl font-bold text-accent">{articles.length}</div>
                <div className="text-base text-zinc-500 mt-2">总文章数</div>
              </div>
              <div className="metal-border rounded-xl bg-card p-8">
                <div className="text-4xl font-bold text-accent">
                  {new Set(articles.map((a) => a.category)).size}
                </div>
                <div className="text-base text-zinc-500 mt-2">分类数</div>
              </div>
              <div className="metal-border rounded-xl bg-card p-8">
                <div className="text-4xl font-bold text-accent">
                  {articles.filter(
                    (a) => a.date === new Date().toISOString().split("T")[0]
                  ).length}
                </div>
                <div className="text-base text-zinc-500 mt-2">今日新增</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      <section className="snap-section px-6">
        <div className="w-full max-w-6xl mx-auto py-16">
          <ScrollReveal animation="up" threshold={0.6}>
            <div className="metal-border overflow-hidden rounded-xl">
              <table className="w-full">
                <thead className="bg-metal-dark">
                  <tr>
                    <th className="px-8 py-5 text-left text-base font-medium text-zinc-400">
                      标题
                    </th>
                    <th className="px-8 py-5 text-left text-base font-medium text-zinc-400">
                      分类
                    </th>
                    <th className="px-8 py-5 text-left text-base font-medium text-zinc-400">
                      日期
                    </th>
                    <th className="px-8 py-5 text-left text-base font-medium text-zinc-400">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-t border-border transition-colors hover:bg-card-hover"
                    >
                      <td className="px-8 py-5">
                        <div className="font-medium text-foreground text-lg">
                          {article.title}
                        </div>
                        <div className="text-sm text-zinc-500 line-clamp-1">
                          {article.summary}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="rounded bg-metal-mid px-4 py-2 text-sm text-accent">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-base text-zinc-500">
                        {article.date}
                      </td>
                      <td className="px-8 py-5">
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-400 transition-colors hover:text-red-300 text-base"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          {articles.length === 0 && (
            <ScrollReveal animation="up" threshold={0.6}>
              <div className="py-24 text-center">
                <p className="text-xl text-zinc-500">暂无文章,点击"新建文章"开始创建</p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <ScrollReveal animation="scale" threshold={0.6}>
            <div className="metal-border w-full max-w-2xl rounded-xl bg-card p-10">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground">
                  {editingArticle ? "编辑文章" : "新建文章"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-zinc-500 transition-colors hover:text-foreground"
                >
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-3 block text-base font-medium text-foreground">
                    标题
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-metal-dark px-5 py-3 text-base text-foreground outline-none transition-all focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-foreground">
                    分类
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="例如:入门教程、干员评测"
                    className="w-full rounded-lg border border-border bg-metal-dark px-5 py-3 text-base text-foreground outline-none transition-all focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-foreground">
                    标签(用逗号分隔)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="例如:新手,基础,指南"
                    className="w-full rounded-lg border border-border bg-metal-dark px-5 py-3 text-base text-foreground outline-none transition-all focus:border-accent"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-foreground">
                    摘要
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-border bg-metal-dark px-5 py-3 text-base text-foreground outline-none transition-all focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-foreground">
                    正文内容
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    className="w-full rounded-lg border border-border bg-metal-dark px-5 py-3 text-base text-foreground outline-none transition-all focus:border-accent font-mono"
                    required
                  />
                </div>

                <div className="flex gap-6 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 rounded-lg border border-border px-8 py-4 text-base text-foreground transition-all hover:border-accent"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-accent px-8 py-4 text-base font-medium text-black transition-all hover:bg-accent-hover"
                  >
                    {editingArticle ? "保存修改" : "发布文章"}
                  </button>
                </div>
              </form>
            </div>
          </ScrollReveal>
        </div>
      )}
    </div>
  );
}