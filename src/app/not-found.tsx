import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 text-6xl font-bold metal-text">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-foreground">
        页面未找到
      </h2>
      <p className="mb-8 text-zinc-400">
        您访问的页面可能被短脖兔吃掉了
      </p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-6 py-3 font-medium text-black transition-all hover:bg-accent-hover"
      >
        返回首页
      </Link>
    </div>
  );
}