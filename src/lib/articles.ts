import articlesData from "@/data/articles.json";
import type { Article } from "@/types";

const articles = articlesData as Article[];

export function getArticles(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getCategories(): string[] {
  const categories = new Set(articles.map((a) => a.category));
  return Array.from(categories);
}

export function addArticle(article: Omit<Article, "id">): Article {
  const newArticle: Article = {
    ...article,
    id: String(Date.now()),
  };
  articles.push(newArticle);
  return newArticle;
}

export function updateArticle(id: string, updates: Partial<Article>): Article | undefined {
  const index = articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    articles[index] = { ...articles[index], ...updates };
    return articles[index];
  }
  return undefined;
}

export function deleteArticle(id: string): boolean {
  const index = articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    articles.splice(index, 1);
    return true;
  }
  return false;
}